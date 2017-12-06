
/**
 * Server module
 * @Module server
 */

var http = require('http');
var colors = require('colors');

var handlers = require('./handlers');

var image = new RegExp('^/image/.*');
var up = new RegExp('\\.\\.');

function start() {
  function onRequest(request, response) {
    console.log('Odebrano zapytanie'.green);
    console.log('Zapytanie ' + request.url + ' odebrane.');

    if (up.test(request.url)) {
      handlers.error(request, response);
      return;
    }

    switch (request.url) {
      case '/':
      case '/start':
        handlers.start(request, response);
        break;
      case '/upload':
        handlers.upload(request, response);
        break;
      case '/css/styleStart.css':
      case '/css/styleUpload.css':
        handlers.style(request, response);
        break;
      default:
        if (image.test(request.url)) {
          handlers.show(request, response);
        } else {
          handlers.error(request, response);
        }

    }
  }

  http.createServer(onRequest).listen(9000);
  console.log('Uruchomiono serwer !'.green);
}

/**
 * start - starts http server
 * @function
 */
exports.start = start;
