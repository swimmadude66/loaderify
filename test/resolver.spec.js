var assert = require('assert');
var path = require('path');
var resolver = require('../dist/resolver').Resolver;

describe('path resolution', function() {
    it('still finds app.js with no extension', function() {
        var foundName = resolver.resolveUnKnownExtension(path.join(__dirname, './test_app/src/app'));
        assert.notEqual(!!foundName, false, 'no file found');
        var rel = path.relative(__dirname, foundName).replace(/\\/g, '/');
        assert.equal(rel, 'test_app/src/app.js', 'found incorrect file ' + rel);
    });

    it('defaults to index.js when no file is provided', function() {
        var foundName = resolver.resolveUnKnownExtension(path.join(__dirname, './test_app/src'));
        assert.notEqual(!!foundName, false, 'no file found');
        var rel = path.relative(__dirname, foundName).replace(/\\/g, '/');
        assert.equal(rel, 'test_app/src/index.js', 'found incorrect file ' + rel);
    });

    it('ignores trailing slashes', function() {
        var foundName = resolver.resolveUnKnownExtension(path.join(__dirname, './test_app/src/'));
        assert.notEqual(!!foundName, false, 'no file found');
        var rel = path.relative(__dirname, foundName).replace(/\\/g, '/');
        assert.equal(rel, 'test_app/src/index.js', 'found incorrect file ' + rel);
    });
});