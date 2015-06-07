'use strict';

var xhr = require('../xhr');

function makeUrl(service, args) {
    args.key = module.parent.exports.config['API_KEY'];

    return [
        service,
        Object.keys(args).map(function(key) {
            return [key, args[key]].join('=');
        }).join('&'),
    ].join('?');
}

(function() {

    Object.defineProperty(this, 'SERVICE_URL', {
        value : 'https://maps.googleapis.com/maps/api',
        configurable : true,
        enumerable : true,
    });

    Object.defineProperty(this, 'services', {
        value : {
            directions : {
                url : this.API_DIRECTIONS,
            },
            staticmaps : {
                url : this.API_STATIC_MAPS,
            },
            distancematrix : {
                url : this.API_DISTANCE_MATRIX,
            },
        },
        configurable : true,
        enumerable : true,
    });

    Object.defineProperty(this, 'API_DIRECTIONS', {
        value : this.SERVICE_URL + '/directions/json',
        configurable : true,
        enumerable : true,
    });

    Object.defineProperty(this, 'API_STATIC_MAPS', {
        value : this.SERVICE_URL + '/staticmap',
        configurable : true,
        enumerable : true,
    });

    Object.defineProperty(this, 'API_DISTANCE_MATRIX', {
        value : this.SERVICE_URL + '/distancematrix/json',
        configurable : true,
        enumerable : true,
    });

    Object.defineProperty(this, 'API_ELEVATION', {
        value : this.SERVICE_URL + '/elevation/json',
        configurable : true,
        enumerable : true,
    });

    this.directions = function(args, onSuccess, onError) {
        var self = this;

        return xhr.get.apply(xhr, [
            makeUrl(this.API_DIRECTIONS, args),
            function(result) {
                if (/^OK$/.test(result.status)) {
                    onSuccess && onSuccess(result.routes.map(function(route) {
                        Object.defineProperty(route, 'staticMap', {
                            value : function(args) {
                                if (args.path) {
                                    args.path += '%7Cenc:' + route.overview_polyline.points;
                                }

                                return self.staticMap.apply(self, arguments);
                            },
                            configurable : true,
                            enumerable : true,
                        });
                        return route;
                    }));
                } else {
                    onError && onError({
                        message : result.error_message || result.status
                    });
                }
            },
            onError,
        ]);
    };

    this.staticMap = function(args, onSuccess, onError) {
        return xhr.get.apply(xhr, [
            makeUrl(this.API_STATIC_MAPS, args),
            onSuccess,
            onError,
        ]);
    };

    this.distanceMatrix = function(args, onSuccess, onError) {
        return xhr.get.apply(xhr, [
            makeUrl(this.API_DISTANCE_MATRIX, args),
            function(result) {
                if (/^OK$/.test(result.status)) {
                    var matrix = [];

                    for (var i = 0; i < result.rows.length; i++) {
                        var row = [];

                        for (var j = 0; j < result.rows[i].elements.length; j++) {
                            (function(i, j) {
                                this.origin = result.origin_addresses[i];
                                this.destination = result.destination_addresses[j];
                                row.push(this);
                            }).call(result.rows[i].elements[j], i, j);
                        }

                        matrix.push(row);
                    }

                    onSuccess && onSuccess(matrix);
                } else {
                    onError && onError({
                        message : result.error_message || result.status
                    });
                }
            },
            onError,
        ]);
    };

    this.elevation = function(args, onSuccess, onError) {
        return xhr.get.apply(xhr, [
            makeUrl(this.API_ELEVATION, args),
            function(result) {
                if (/^OK$/.test(result.status)) {
                    onSuccess && onSuccess(result.results);
                } else {
                    onError && onError({
                        message : result.error_message || result.status
                    });
                }
            },
            onError,
        ]);
    };

}).call(module.exports);

