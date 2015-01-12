/*
 * Dependencies
 */
const vertx = require('vertx');
const console = require('vertx/console');

/*
 * Constants
 */
const port = 8082;
const domain =  'localhost';

var server = vertx.createHttpServer();

console.log('Server listerning to ' + domain + ':' + port);

server.requestHandler(function(req) {
  var reqPath = req.path();
  var file = '';

  console.log('request path: ' + reqPath);

  if (reqPath === '/') {
    file = '/index.html';
  } else if (reqPath.indexOf('..') === -1) {
    file = reqPath;
  }

  console.log('serving file: public' + file);

  req.response.sendFile('public' + file);
});

var sockJSServer = vertx.createSockJSServer(server);

sockJSServer.bridge(
  { prefix: '/eventbus' },
  [
    { address: 'comments.create_comment'},
    { address: 'comments.get_comments'}
  ],
  [
    { address: 'comments.all_comments' }
  ]
);

server.listen(port, domain);