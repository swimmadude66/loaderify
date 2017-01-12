import {readFileSync} from 'fs';
import {join, dirname, relative} from 'path';
import {cwd} from 'process';
import * as async from 'async';
import * as through  from 'through2';
import {Loader, LoaderifyOpts} from './models';

const requireRegex = /require\s*\(['"`](\.[^)]+)['"`]\)/g;

function regexEscape(s: string): string {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function wildcardToRegex(pattern: string): string {
    let cleanPattern = regexEscape(pattern);
    let regex = cleanPattern
        .replace(/\\\*\\\*(\/\\\*(?!\\\*))?/g, '.*')
        .replace(/\\\*/g, '[^/\\]*');
    return `^${regex}$`;
}

function transform(file: string, opts: LoaderifyOpts) {
    if (!opts) {
        opts = {};
    }
    let patterns = {};
    (opts.loaders || []).forEach((loader: Loader) => {
        let rxp = wildcardToRegex(loader.Pattern);
        patterns[rxp] = loader.Function;
    });
    return through((buf, enc, next) => {
        let chunk = buf.toString('utf8');
        let requires = chunk.match(requireRegex) || [];
        async.eachSeries(requires, function(required, cb) {
            let target = required.replace(requireRegex, '$1');
            let filepath = join(dirname(file), target);
            let matcher = relative(cwd(), filepath);
            let match: string;
            for (let ptrn in patterns) {
                if (patterns.hasOwnProperty(ptrn)) {
                    let pattern = new RegExp(ptrn);
                    if (pattern.test(matcher)) {
                        match = ptrn;
                        break;
                    }
                }
            }
            if (!match) {
                return cb();
            }
            let callback = patterns[match];
            try {
                let contents = readFileSync(filepath).toString();
                callback(matcher, contents, (abort, results) => {
                    if (!abort) {
                        chunk = chunk.replace(required, results);
                    }
                    return cb();
                });
            } catch (error) {
                return cb(error);
            }
        }, (err) => {
            if (err)  {
                throw err;
            }
            return next(null, chunk);
        });
    });
};

module.exports = transform;
