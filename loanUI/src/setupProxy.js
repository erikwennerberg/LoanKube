const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    require('dotenv').config()  
    app.use('/metrics', createProxyMiddleware({target: `http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}`}));
    app.use('/uloans', createProxyMiddleware({target: `http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}`}));
    app.use('/submit', createProxyMiddleware({target: `http://${process.env.LOANPROCESSOR_SERVICE_HOST}:${process.env.LOANPROCESSOR_SERVICE_PORT}`, pathRewrite: {'^/submit': ''}}));
};