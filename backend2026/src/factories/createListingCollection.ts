// src/collections/factories/createListingCollection.ts
import type { CollectionConfig, Field } from 'payload'
import { Address, Contact, Gallery, Geo, SEO } from '../../fields/shared'

/**
 * Utility locale per generare lo slug da title.
 * Evita dipendenze esterne e tiene tutto DRY.
 */
const slugify = (input: string) =>
  input
    ?.toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove diacritici
    .replace(/[^a-z0-9]+/g, '-')     // sostituisce non-alfa con '-'
    .replace(/^-+|-+$/g, '')         // trim '-'
    .slice(0, 120) || ''

/**
 * Factory per generare una Collection "listing" riusabile.
 * - Campi base inclusi: title, slug (auto), published, cover, excerpt, gallery, address, geo, contact, SEO
 * - Relazione obbligatoria con BORGO (se requireBorgo = true)
 * - Access rules semplici e sicure (estendibili più avanti)
 * - Compatibile con SQLite in dev e Postgres (Supabase) in prod
 */
export const createListingCollection = (opts: {
  slug: string
  labels: { singular: string; plural: string }
  readOnly?: boolean            // se true: nessun "create" da admin (solo ingest partner / admin override)
  requireBorgo?: boolean        // se true: relationship 'borgo' required
  extraFields?: Field[]         // per estensioni verticali (es. prezzo, durata, ecc.)
}): CollectionConfig => {
  const {
    slug,
    labels,
    readOnly = false,
    requireBorgo = true,
    extraFields = [],
  } = opts

  return {
    slug,
    labels,
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'borgo', 'published', 'updatedAt'],
      disableCreate: Boolean(readOnly),
    },
    versions: {
      drafts: true, // bozza/pubblicato out-of-the-box; utile per workflow editoriale
    },
    access: {
      read: () => true,
      // In questa fase consenti create/update/delete solo a utenti autenticati.
      // Più avanti potrai passare a regole per ruolo/owner.
      create: ({ req }) => (readOnly ? false : Boolean(req.user)),
      update: ({ req }) => Boolean(req.user),
      delete: ({ req }) => Boolean(req.user),
    },
    fields: [
      // TITOLO
      {
        name: 'title',
        label: 'Titolo',
        type: 'text',
        required: true,
      },

      // SLUG auto da title (se non presente)
      {
        name: 'slug',
        label: 'Slug',
        type: 'text',
        unique: true,
        admin: { description: 'Se lasciato vuoto, viene generato dal Titolo' },
        hooks: {
          beforeValidate: [
            ({ data }) => {
              if (data) {
                if (!data.slug && data.title) data.slug = slugify(data.title)
                if (typeof data.slug === 'string') data.slug = slugify(data.slug)
              }
            },
          ],
        },
      },

      // PUBBLICAZIONE / DRAFT
      {
        name: 'published',
        label: 'Pubblicato',
        type: 'checkbox',
        defaultValue: false,
      },

      // COVER (facoltativa) + GALLERY riusabile
      {
        name: 'cover',
        label: 'Cover',
        type: 'upload',
        relationTo: 'media',
      },
      Gallery,

      // RELAZIONE AL BORGO (obbligatoria se richiesto)
      {
        name: 'borgo',
        label: 'Borgo / Comune',
        type: 'relationship',
        relationTo: 'borghi',
        required: requireBorgo,
      },

      // OWNER (utile per policy future)
      {
        name: 'owner',
        label: 'Owner',
        type: 'relationship',
        relationTo: 'users',
        admin: { position: 'sidebar' },
      },

      // DESCRIZIONE BREVE
      {
        name: 'excerpt',
        label: 'Descrizione breve',
        type: 'textarea',
      },

      // CAMPI RIUSABILI
      Address,
      Geo,
      Contact,

      // SEO GROUP
      SEO,

      // ESTENSIONI SPECIFICHE (opzionali)
      ...extraFields,
    ],
  }
}
