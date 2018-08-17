const Prometheus = require('prom-client')
const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const HttpRequestDuration = new Prometheus.Histogram({
                                  name: 'http_request_duration_ms',
                                  help: 'Duration of HTTP requests in ms',
                                  labelNames: ['method', 'route', 'code'],
                                  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
                                })

const observe = (method, path, statusCode, startEpoch) => {
  path = path ? path.toLowerCase() : ''
  if (path !== '/metrics' && path !== '/metrics/') {
    const responseTimeInMs = Date.now() - startEpoch
    HttpRequestDuration.labels(method, path, statusCode).observe(responseTimeInMs)
  }
};

module.exports = {
  observe,
  metrics: () => Prometheus.register.metrics(),
  contentType: () => Prometheus.register.contentType
}