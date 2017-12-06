
/**
 * @Module handlers
 */
var fs = require('fs');

/**
 * start - returns welcome (start) page
 *
 * @param  {object} request - object defined in http module
 * @param  {object} response - object defined in http module
 */
exports.start = function (request, response) {
  'use strict';
  console.log('Rozpoczynam obsługę żądania start');
  fs.readFile('./templates/start.html', function (err, html) {
    console.assert(!err, err);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=uft-8' });
    response.write(html);
    response.end();
  });
};

/**
 * style - retsurns css style sheets
 *
 * @param  {object} request - object defined in http module
 * @param  {object} response - object defined in http module
 */
exports.style = function (request, response) {
  'use strict';
  console.log('Rozpoczynam obsługę żądania css');
  fs.readFile('./templates' + request.url, function (err, cssFile) {
    console.assert(!err, err);
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(cssFile);
    response.end();
  });
};

var formidable = require('formidable');
var util = require('util');

/**
 * upload - uploads files on server
 *
 * @param  {object} request - object defined in http module
 * @param  {object} response - object defined in http module
 */

exports.upload = function (request, response) {
  'use strict';
  console.log('Rozpoczynam obsługę żądania upload.');
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(request, function (error, fields, files) {
    console.assert(!error, error);
    /* console.log(util.inspect({ fields: fields, files: files },
      { showHidden: false, depth: null }));*/
    fs.readFile('./templates/upload.html', function (err, html) {
      console.assert(!err, err);
      response.writeHead(200, { 'Content-Type': 'text/html; charset=uft-8' });
      response.write(html);
      if (Array.isArray(files.upload)) {
        files.upload.forEach(function (file) {
          uploadSend(file);
        });
      } else {
        uploadSend(files.upload);
      }

      response.end('</div></body></html>');
    });

  });

  function uploadSend(file) {
    if (file.type === 'image/png'  ||
        file.type === 'image/jpeg' ||
        file.type === 'image/gif') {
      fs.renameSync(file.path, './show/' + file.type + '/' + file.name);
      var url = '/'  + file.type + '/' + file.name;
      var html = '<a href="' + url + '">' + '<img src="' + url + '">' + '</a>';
      response.write(html);
    }
  }
};

png = new RegExp('^/image/png.*');
jpeg = new RegExp('^/image/jpeg.*');
gif = new RegExp('^/image/gif.*');

/**
 * show - returns uploaded image file
 *
 * @param  {object} request - object defined in http module
 * @param  {object} response - object defined in http module
 */
exports.show = function (request, response) {
  'use strict';
  if (request.url !== '/image/' && fs.existsSync('./show' + request.url)) {
    fs.readFile('./show' + request.url, 'binary', function (err, file) {
          var contentType = {};
          if (png.test(request.url)) {
            contentType = { 'Content-Type': 'image/png' };
          } else if (jpeg.test(request.url)) {
            contentType = { 'Content-Type': 'image/jpeg' };
          } else if (gif.test(request.url)) {
            contentType = { 'Content-Type': 'image/gif' };
          }

          if (contentType !== {}) {
            response.writeHead(200, contentType);
            response.write(file, 'binary');
          } else {
            response.writeHead(500, { 'Content-Type': 'text/html; charset=uft-8' });
            response.write(':(');
          }

          response.end();
        });
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=uft-8' });
    response.write('file: ' + request.url + ' not found');
    response.end();
  }
};

/**
 * error - used for 404 error
 *
 * @param  {object} request - object defined in http module
 * @param  {object} response - object defined in http module
 */
exports.error = function (request, response) {
  console.log('Nie wiem co robić.');
  response.writeHead(404, { 'Content-Type': 'text/html; charset=uft-8' });
  response.write('404 :(');
  response.end();
};
