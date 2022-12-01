const {createProxyMiddleware} = require('http-proxy-middleware');

//프록시 설정 - '/api'를 포함해서 요청시 자동으로 target으로 요청함
module.exports = (app) => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true
        })
    );
};
// 118.128.215.124