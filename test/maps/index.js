var should = require('should');
var googleapis = require('../../');

googleapis.config = {
    API_KEY : process.env.GOOGLE_API_KEY,
};

describe('GoogleAPIs', function() {
    describe('#maps', function() {

        describe('#directions()', function() {
            it('should return routes', function(done) {
                googleapis.maps.directions({
                    origin : 'Beijing',
                    destination : 'Shanghai',
                }, function(routes) {
                    routes.length.should.be.above(0);
                    routes.forEach(function(route) {
                        route.staticMap({
                            size : '640x640',
                            path : 'weight:5%7Ccolor:0xff0000'
                        }, function(image) {
                            image.length.should.be.above(0);
                            return done();
                        }, function(e) {
                            return done(e);
                        });
                    });
                }, function(e) {
                    return done(e);
                });
            });
        });

        describe('#distanceMatrix()', function() {
            it('should return distance matrix', function(done) {
                googleapis.maps.distanceMatrix({
                    origins : 'Beijing|Shanghai',
                    destinations : 'Shenzhen|Guangzhou',
                }, function(matrix) {
                    matrix.length.should.be.above(0);
                    matrix.forEach(function(row) {
                        row.length.should.be.above(0);
                    });
                    return done();
                }, function(e) {
                    return done(e);
                });
            });
        });

        describe('#staticMap()', function() {
            it('should return an image', function(done) {
                googleapis.maps.staticMap({
                    size : '640x640',
                    path : 'path=color:0xff0000|weight:5|40.737102,-73.990318|40.749825,-73.987963|40.752946,-73.987384|40.755823,-73.986397',
                }, function(image) {
                    image.length.should.be.above(0);
                    return done();
                }, function(e) {
                    return done(e);
                });
            });
        });

        describe('#elevation()', function() {
            it('should return the elevations', function(done) {
                googleapis.maps.elevation({
                    locations : '39.7391536,-104.9847034|36.455556,-116.866667',
                }, function(elevations) {
                    elevations.length.should.be.above(0);
                    return done();
                }, function(e) {
                    return done(e);
                });
            });
        });
    });
});
