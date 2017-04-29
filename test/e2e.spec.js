// var loaderify = require('../dist/loaderify');
// var fs = require('fs');
// var browserify = require('browserify');

// process.cwd = function(){return __dirname;};
// var srcPath = './test_app/src/app.js';
// var distPath = './test_app/dist.app.js';

// describe('loaderify', function() {
//     var inputFile, outputFile;
//     beforeEach(function(){
//         inputFile = fs.createReadStream(srcPath);
//         if(fs.existsSync(distPath)){
//             fs.unlinkSync(distPath);
//         }
//         outputFile = fs.createWriteStream('./test_app/dist.app.js');
//     });
//     it('Replaces .css files with contents', function(done){
//         var bundle = browserify({})
//         .add(srcPath) 
//         .transform(loaderify, {
//             loaders: [
//                     {Pattern: '**/test.css', Function: function(filepath, contents, callback){return callback(null, '`'+contents+'`');}}
//                 ]
//         })
//         .bundle();
//         bundle.pipe(outputFile);
//         var output = fs.readFileSync(distPath).toString();
//         var expected = fs.readFileSync('./test_app/src/test.css').toString();
//         output.should.equal(expected);
//         return done();
//     });
// });

