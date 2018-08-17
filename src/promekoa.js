const instrumentator = require('./instrumentator')

const middleware = async (ctx, next) => {
  const startEpoch = Date.now()
  await next()
  instrumentator.observe(ctx.method, ctx.path, ctx.status, startEpoch)
};

const instrument = (app, router) => {
  app.use(middleware)
  router.get('/metrics', ctx => {
    ctx.set('Content-Type', instrumentator.contentType())
    ctx.body = instrumentator.metrics()
  })
};

module.exports = {
  instrument
};