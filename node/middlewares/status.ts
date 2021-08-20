import { collectDefaultMetrics, register, Counter } from '/usr/local/app/node_modules/prom-client'

const c = new Counter({
  name: "test_wololo",
  help: "asdfasfd"
})

export async function status(ctx: Context, next: () => Promise<any>) {
  const {
    state: { code },
    clients: { status: statusClient },
  } = ctx

  c.inc(10);

  console.info('Received code:', code)

  const statusResponse = await statusClient.getStatus(code)

  console.info('Status response:', statusResponse)

  const {
    headers,
    data,
    status: responseStatus,
  } = await statusClient.getStatusWithHeaders(code)

  console.info('Status headers', headers)
  console.info('Status data:', data)

  ctx.status = responseStatus
  ctx.body = data
  ctx.set('Cache-Control', headers['cache-control'])

  ctx.set('Content-Type', register.contentType)
  ctx.body = register.metrics()
  ctx.status = 200

  await next()
}
