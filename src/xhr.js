'use strict';

var url = require('url');
var http = require('http');
var https = require('https');

function handleResponse(res, onSuccess, onError) {
    var chunks = [];
    var length = 0;
    var contentType = res.headers['content-type'];

    if (200 != res.statusCode) {
        return onError({
            errno : -1,
            status : {
                code    : res.statusCode,
                message : res.statusMessage,
            },
        });
    }

    res.on('data', function(chunk) {
        chunks.push(chunk);
        length += chunk.length;
    }).on('end', function() {
        var body = new Buffer(length);
        var offset = 0;

        chunks.forEach(function(chunk) {
            chunk.copy(body, offset);
            offset += chunk.length;
        });

        if (/json/.test(contentType)) {
            try {
                return onSuccess(JSON.parse(body.toString()));
            } catch (e) {
                return onError(e);
            }
        } else if (/text/.test(contentType)) {
            return onSuccess(body.toString());
        } else {
            return onSuccess(body);
        }
    }).on('error', function(e) {
        return onError(e);
    });
}

function doRequest(options, onSuccess, onError) {
    var self = this;
    var uri = url.parse(options.url);
    var ssl = /https/.test(uri.protocol);
    var req = (ssl ? https : http).request({
        hostname : uri.hostname,
        port     : uri.port || (ssl ? 443 : 80),
        path     : uri.path,
        method   : options.method || 'GET',
        headers  : options.headers || {},
    }, function(res) {
        return handleResponse.call(self, res, onSuccess, onError);
    }).on('error', onError);

    if (options.body) {
        req.write(String(options.body));
    }

    req.end();
}

(function() {

    this.get = function(url, onSuccess, onError) {
        return doRequest.apply(this, [
            {
                url    : url,
                method : 'GET',
            },
            onSuccess || console.log,
            onError || console.error,
        ]);
    };

    this.post = function(options, onSuccess, onError) {
        options.method = 'POST';

        return doRequest.apply(this, [
            options,
            onSuccess || console.log,
            onError || console.error,
        ]);
    };

}).call(module.exports);

