var fs = require('fs');
var path = require('path');
var async = require('async');
var through = require('through2');
var requireRegex = /require\s*\(['"`](\.[^)]+)['"`]\)/g;

function regexEscape(s) {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function wildcardToRegex(pattern) {
    var cleanPattern = regexEscape(pattern);
    regex = cleanPattern
        .replace(/\\\*\\\*(\/\\\*(?!\\\*))?/g, '.*')
        .replace(/\\\*/g, '[^/\\]*');
    return '^'+regex+'$';
}

var transform = function(file, opts){
    if (opts)
    var patterns = {};
    (opts.loaders || []).forEach(function(loader){
        var rxp = wildcardToRegex(loader.Pattern);
        patterns[rxp] = loader.Function;
    });
    return through(function(buf, enc, next) {
        var chunk = buf.toString('utf8');
        var requires = chunk.match(requireRegex) || [];
        async.eachSeries(requires, function(required, cb) {
            var target = required.replace(requireRegex, '$1');
            var filepath = path.join(path.dirname(file), target);
            var matcher = path.relative(process.cwd(), filepath);
            var matching = false;
            for(var ptrn in patterns) {
                if(patterns.hasOwnProperty(ptrn)) {
                    var pattern = new RegExp(ptrn);
                    var callback = patterns[ptrn];
                    if (pattern.test(matcher)) {
                        matching = true;
                        try {
                            var contents = fs.readFileSync(filepath).toString();
                            callback(matcher, contents, function(abort, results){
                                if(abort){
                                    return cb();
                                }
                                chunk = chunk.replace(required, results);
                                return cb();
                            });
                        } catch (error) {
                            return cb(error);
                        }
                    }
                }
            }
            if(!matching){
                return cb();
            }
        }, function(err){
            if(err){
                throw err;
            }
            return next(null, chunk);
        });
    });
};

module.exports = transform;
