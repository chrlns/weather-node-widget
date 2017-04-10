var http   = require('http');
var static = require('node-static');

function getWeatherData(args, callback) {
    var options = {
        hostname: 'api.openweathermap.org',
        port: 80,
        path: '/data/2.5/weather?units=metric&mode=json' 
                + '&lang=' + args['lang'] 
                + '&lat=' + args['lat'] 
                + '&lon=' + args['lon']
                + '&APPID=' + args['appid'],
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', callback);
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}

var file = new(static.Server)('.');

http.createServer(function (req, res) {
    var args = require('url').parse(req.url, true);

    console.log('Request for ' + args['pathname']);

    if(args['pathname'] == '/weather') {
        res.writeHead(200, {'Content-Type': 'application/json'});

        getWeatherData(args['query'], function(data) {
            res.end(data);
        });
    } else {
        req.addListener('end', function () {
            file.serve(req, res);
        }).resume();
    }
}).listen(61081);

console.log('Weather Server running');
