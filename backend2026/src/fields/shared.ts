// src/fields/shared.ts
import type { Field } from 'payload';

export const Address: Field = {
  name: 'address',
  type: 'group',
  admin: { description: 'Indirizzo della sede/luogo' },
  fields: [
    { name: 'street', label: 'Via', type: 'text', required: true },
    { name: 'zip', label: 'CAP', type: 'text' },
    { name: 'city', label: 'Città', type: 'text', required: true },
    { name: 'province', label: 'Provincia', type: 'text' },
    { name: 'country', label: 'Nazione', type: 'text', required: true, defaultValue: 'Italia' },
  ],
};

export const Geo: Field = {
  name: 'geo',
  type: 'group',
  admin: { description: 'Coordinate geografiche' },
  fields: [
    { name: 'lat', label: 'Lat', type: 'number' },
    { name: 'lng', label: 'Lng', type: 'number' },
  ],
};

export const Contact: Field = {
  name: 'contact',
  type: 'group',
  admin: { description: 'Contatti ufficiali' },
  fields: [
    { name: 'phone', label: 'Telefono', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'website', label: 'Sito web', type: 'text' },
    { name: 'facebook', label: 'Facebook', type: 'text' },
    { name: 'instagram', label: 'Instagram', type: 'text' },
  ],
};

export const SEO: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Meta e OpenGraph' },
  fields: [
    { name: 'title', label: 'SEO Title', type: 'text' },
    { name: 'description', label: 'SEO Description', type: 'textarea' },
    { name: 'slug', label: 'Slug', type: 'text', required: true, unique: true },
    { name: 'ogImage', label: 'OG Image', type: 'upload', relationTo: 'media' },
  ],
};

export const Gallery: Field = {
  name: 'gallery',
  type: 'array',
  label: 'Galleria',
  admin: { description: 'Immagini di presentazione' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Immagine' },
    { name: 'caption', type: 'text', label: 'Didascalia' },
  ],
};
