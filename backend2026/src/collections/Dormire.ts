// src/collections/Dormire.ts
import type { CollectionConfig } from 'payload';
import { createListingCollection } from './factories/createListingCollection';

export const Dormire: CollectionConfig = createListingCollection({
  slug: 'dormire',
  labels: {
    singular: 'Struttura Ricettiva',
    plural: 'Dormire',
  },
});
