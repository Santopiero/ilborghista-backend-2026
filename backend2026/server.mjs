// server.mjs — avvio Payload Admin + API senza Next.js
import express from 'express'
import payload from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

process.env.PAYLOAD_CONFIG_PATH =
  process.env.PAYLOAD_CONFIG_PATH || path.resolve(__dirname, 'src/payload.config.ts')

async function start() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: () => {
      payload.logger.info(`✅ Payload Admin ready at http://0.0.0.0:${PORT}/admin`)
    },
  })

  app.get('/', (_, res) => {
    res.send('✅ API OK - Payload è attivo')
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening at http://0.0.0.0:${PORT}`)
  })
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
