import config from '@payload-config'
import { routeHandler } from '@payloadcms/next/routeHandler'

// Per garantire esecuzione sempre server-side, senza cache
export const dynamic = 'force-dynamic'

// Esponiamo tutti i metodi HTTP supportati
export const { GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD } = routeHandler({
  config,
})
