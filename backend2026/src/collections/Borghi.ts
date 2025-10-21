// src/collections/Borghi.ts
import type { CollectionConfig } from 'payload';
import { Address, Geo, SEO } from '../fields/shared';

export const Borghi: CollectionConfig = {
  slug: 'borghi',
  labels: { singular: 'Borgo', plural: 'Borghi' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'province', 'updatedAt'] },
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => req.user?.role === 'admin' },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'province', label: 'Provincia', type: 'text' },
    Address,
    Geo,
    SEO,
  ],
};
