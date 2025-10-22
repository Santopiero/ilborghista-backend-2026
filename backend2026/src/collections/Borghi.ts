// src/collections/Borghi.ts
import type { CollectionConfig } from 'payload'

/** utilità semplice per generare slug dal title */
const slugify = (input: string) =>
  (input ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)

export const Borghi: CollectionConfig = {
  slug: 'borghi',
  admin: {
    useAsTitle: 'title',
    labels: {
      singular: 'Borgo',
      plural: 'Borghi',
    },
    defaultColumns: ['title', 'regione', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      label: 'Nome borgo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: { description: 'Se vuoto, viene generato automaticamente dal nome' },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data) return
            if (!data.slug && data.title) data.slug = slugify(data.title)
            if (typeof data.slug === 'string') data.slug = slugify(data.slug)
          },
        ],
      },
    },
    {
      name: 'regione',
      label: 'Regione',
      type: 'select',
      required: true,
      options: [
        'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
        'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
        'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
        'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto',
      ].map((r) => ({ label: r, value: r })),
    },
    {
      name: 'descrizioneBreve',
      label: 'Descrizione breve',
      type: 'textarea',
      admin: { description: 'Massimo 300 caratteri' },
      validate: (val: unknown) => {
        if (!val) return true
        if (typeof val !== 'string') return 'Testo non valido'
        return val.length <= 300 || 'Max 300 caratteri'
      },
    },
    {
      name: 'immagineCopertina',
      label: 'Immagine di copertina',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'immaginiGalleria',
      label: 'Galleria immagini',
      type: 'array',
      fields: [
        {
          name: 'immagine',
          label: 'Immagine',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'did',
          label: 'Didascalia',
          type: 'text',
        },
      ],
    },
    // NOTE: predisposizione per relazioni future (itinerari / eventi)
    // Quando avremo le collection, potremo aggiungere:
    // {
    //   name: 'itinerari',
    //   label: 'Itinerari',
    //   type: 'relationship',
    //   relationTo: 'itinerari',
    //   hasMany: true,
    // },
    // {
    //   name: 'eventi',
    //   label: 'Eventi e sagre',
    //   type: 'relationship',
    //   relationTo: 'eventi',
    //   hasMany: true,
    // },
  ],
}
