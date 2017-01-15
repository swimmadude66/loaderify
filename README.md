# loaderify
_A Browserify transform which allows one to add functional loaders on matching `require()` statements, similar to webpack_

`npm install --save-dev loaderify`

I wrote this transform after spending hours trying to find a way to inject templates and styles in to my Angular (ng2+) components that ALSO supported minifications, less, sass, emmet, etc.
There were transforms for injecting html and css ([stringify](https://github.com/JohnPostlethwait/stringify)), but they hung on minification. 
There were transforms to inject scss/sass ([scssify](https://github.com/cody-greene/scssify)) but they injected `<style>` tags instead of just strings.
Worse yet, the two transforms didn't get along well together, meaning I could choose between un-minified templates and css, or scss with no templates.

__I didn't like those options__

I'd seen this exact problem solved at work, where we use webpack. In webpack, you specify `loaders` for files matching certain patterns. These loaders can be functions or chains of functions,
which operate on the source file and return a modified source. Seemed like a simple enough thing to do with browserify transforms, so I set about writing this plugin.

##How do I use it?

simply add loaderify in to your bundle process, specifying a list of `loaders` in the config, like so:

```js
    function bundle(){
    return browserify({})
    .add('./entry.js') 
    .transform(loaderify, {
        loaders: [
            {
                Pattern: '**/*.html', 
                Function: injectMinifedHtml
            },
            {
                Pattern: '**/*.scss', 
                Function: injectSass
            },
            {
                Pattern: 'assets/styles/*.css', 
                Function: injectCss
            }
        ]
    })
    .bundle()
    .pipe(gulp.dest('dist/')));
}
```

The strings in `Pattern` are standard wildcard matches. `**` matches 0 or more directories, and `*` matches all files in the current directory. 
So `**/*.html` matches all html files, while `assets/styles/*.css` matches top level `.css` files in the `assets/styles` directory.

The functions in the `Function` key are in the format `function(filelocation, contents, callback)`, where `filelocation` is the location of the required file relative to `process.cwd()` 
and `contents` holds the contents. 
The body can do whatever it wants to transform those contents, and when they are passed back to the callback, all instances of `require('./filename')` will be replaced with the 
results of your transforms! 

For conditional transforms, the callback also an `abort` argument in the form of `callback(abort, results)`. That way, your transforms can choose to leave the `require()` statement alone.

##What else can it do?

One possible use for the conditional transforms is environment-specific file loads. A transform could be written like so:

```js
function envSwitch(fileloc, contents, callback){
    var env = process.env;
    if(env !== 'LOCAL') {
        return callback(true);
    } else {
        // find the corresponding mock service
        var mockLocation = path.join(path.dirname(fileloc), 'mock.'+path.basename(fileloc));
        // require the mock service instead!
        return callback(null, 'require(\''+mockLocation+'\')');
    }
}

function bundle(){
    return b
    .add('./entry.js')
    .transform(loaderify, {
        loaders: [
            {
                Pattern: 'services/**/*.js', 
                Function: envSwitch
            }
        ]
    })
    .bundle();
}
```

The possibilities are limitless. Just think how many transforms you can replace with this!


