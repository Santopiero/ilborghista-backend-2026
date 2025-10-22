// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres' // ✅ ora Postgres
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Dormire } from './collections/Dormire'
import { Borghi } from './collections/Borghi'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Dormire, Borghi],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ✅ ORA SIAMO SU SUPABASE (session pooler IPv4 compatibile)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI, // <-- giusto così
    },
    migrationMode: 'safe', // evita disastri, NON forza mai da solo
  }),

  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
