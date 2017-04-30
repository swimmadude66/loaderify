var assert = require('assert');
var cleaner = require('../dist/cleaner').Cleaner;

describe('cleaner', function() {
    it('returns escaped regex for exact filepath', function(){
        var output = cleaner.wildcardToRegex('/assets/styles.css');
        return assert.equal(output, '^/assets/styles\\.css$');
    });
    it('converts ** into .*', function(){
        var output = cleaner.wildcardToRegex('/assets/**.css');
        return assert.equal(output, '^/assets/.*\\.css$');
    });
    it('converts * into [^/\\]*', function(){
        var output = cleaner.wildcardToRegex('/assets/*.css');
        return assert.equal(output, '^/assets/[^/\\\\]*\\.css$');
    });
    it('converts **/* into .*', function(){
        var output = cleaner.wildcardToRegex('/assets/**/*.css');
        return assert.equal(output, '^/assets/.*\\.css$');
    });
    it('matches * after conversion', function(){
        var output = cleaner.wildcardToRegex('/assets/*.css');
        var pattern = new RegExp(output);
        assert.equal(pattern.test('/assets/styles.css'), true, 'Did not match conforming file');
        assert.equal(pattern.test('/assets/styles2.css'), true, 'Did not match conforming file');
        assert.equal(pattern.test('/assets/styles/deep.css'), false, 'Matched too deep');
        assert.equal(pattern.test('/assets/styles.less'), false, 'Matched a non-conforming filetype');
    });
    it('matches ** after conversion', function(){
        var output = cleaner.wildcardToRegex('/assets/**/styles.css');
        var pattern = new RegExp(output);
        assert.equal(pattern.test('/assets/styles.css'), true, 'Did not match conforming file');
        assert.equal(pattern.test('/assets/styles2.css'), false, 'Matched non-conforming file name');
        assert.equal(pattern.test('/assets/styles/styles.css'), true, 'Did not match conforming file name');
        assert.equal(pattern.test('/assets/styles.less'), false, 'Matched a non-conforming filetype');
    });
});

