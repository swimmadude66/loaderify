import {existsSync, statSync} from 'fs';
const extensions = ['.ts', '.js', '/index.ts', '/index.js', '.json'];

export module Resolver {
    function isFile(filePath: string): boolean {
        return existsSync(filePath) && !statSync(filePath).isDirectory();
    }

    export function resolveUnKnownExtension(fileName: string): string {
        if (isFile(fileName)) {
            return fileName;
        } else {
            fileName = fileName.replace(/[/\\]$/, ''); // remove trailing slashes on dirs
            let foundName;
            extensions.forEach(ext => {
                if (!foundName) {
                    let testName = fileName + ext;
                    if (isFile(testName)) {
                        foundName = testName;
                    }
                }
            });
            return foundName;
        }
    }
}
