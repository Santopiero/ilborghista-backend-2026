// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // *** SEZIONE AGGIUNTA PER RENDER (IMPORTANTISSIMA) ***
  express: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: '0.0.0.0', // obbligatorio per Render
  },
  // *** FINE AGGIUNTA ***

  sharp,

  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
