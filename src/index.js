/**
 * The google API
 * 
 * @namespace google
 */
'use strict';

(function() {

    var settings = {};

    this.maps = require('./maps');

    Object.defineProperty(this, 'config', {
        get : function() {
            var copy = {};

            for (var i in settings) {
                copy[i] = settings[i];
            }

            return copy;
        },
        set : function(newSettings) {
            for (var i in newSettings) {
                settings[i] = newSettings[i];
            }
        },
        configurable : true,
        enumerable : true,
    });

}).call(module.exports);

