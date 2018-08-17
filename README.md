# PromeKoa
Instrument Koa app to Prometheus

[![NPM](https://nodei.co/npm/promekoa.png)](https://nodei.co/npm/promekoa/)

PromeKoa automatically serves [response duration](#duration) metrics, plus nodejs [system metrics](#system) on the `/metrics` path ready to be consumed by Prometheus.

# Instrumentation
The following metrics are instrumented via `/metrics` path:

- **http\_request\_duration\_ms (histogram)**: a [histogram](https://prometheus.io/docs/concepts/metric_types/#histogram) metric used to count duration in buckets of sizes 100ms and 500ms. This can be used to [calculate apdex](https://prometheus.io/docs/practices/histograms/#apdex-score) using a response time threshold of 300ms.

# Installation
```
> npm install promekoa --save
```

To instrument your Koa app you must import the `promekoa` lib and call `instrument` method with required params:

## PromeKoa.instrument(app, router)

  - The first argument represents an instance of Koa `app`. (*required)
  - The second argument represents an instance of `koa-router` (*required)

See the example:

```javascript
const Koa = require('koa');
const Router = require('koa-router')
const PromeKoa = require('promekoa');
const router = new Router()
const app = new Koa();

PromeKoa.instrument(app, router)

router
  .get('/hello', async (ctx, next) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        ctx.body = { "message": 'index route' }
        resolve();
      }, Math.round(Math.random() * 150));
    });
  })
  .get('/users', async (ctx, next) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        ctx.status = 500
        ctx.body = { "Error": 'Error to fetching users' }
        resolve();
      }, Math.round(Math.random() * 400));
    });
  })

app.use(router.routes())

app.listen(3001);
```
