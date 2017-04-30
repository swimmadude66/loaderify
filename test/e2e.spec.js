var loaderify = require('../dist/loaderify');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var srcPath = path.join(__dirname, './test_app/src/app.js');
var distPath = path.join(__dirname, './test_app/dist.app.js');

describe('loaderify', function() {
    var inputFile, outputFile;

    beforeEach(function(){
        inputFile = fs.createReadStream(srcPath);
        if(fs.existsSync(distPath)){
            fs.unlinkSync(distPath);
        }
        outputFile = fs.createWriteStream(distPath);
    });

    it('Replaces .css files with contents', function(done){
        var entry = srcPath;
        var opts = {
            loaders: 
            [
                {Pattern: '**/test.css', Function: function(filepath, contents, callback){return callback(null, '\''+contents.replace(/\s+/g, '')+'\'');}}
            ]
        };
        var transform = loaderify(entry, opts);
        inputFile.pipe(transform).pipe(outputFile);

        outputFile.once('close', function(){
            var result = fs.readFileSync(distPath).toString().replace(/\s*/g, '');
            assert.equal(result, 'module.exports={css:\'.html,body{min-width:320px;}\'};');
            return done();
        });
    });
});

