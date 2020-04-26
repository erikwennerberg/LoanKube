const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/metrics', createProxyMiddleware({target: `http://${process.env.LOANDATA_SERVICE}`}));
    app.use('/uloans', createProxyMiddleware({target: `http://${process.env.LOANDATA_SERVICE}`}));
    app.use('/submit', createProxyMiddleware({target: `http://${process.env.LOANPROCESSOR_SERVICE}`, pathRewrite: {'^/submit': ''}}));
};