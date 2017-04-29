export module Cleaner {
    function regexEscape(input: string): string {
        return input.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    export function wildcardToRegex(pattern: string): string {
        let cleanPattern = regexEscape(pattern);
        let regex = cleanPattern
            .replace(/\\\*\\\*\/?(\\\*(?!\\\*))?/g, '.*')
            .replace(/\\\*/g, '[^/\\\\]*');
        return `^${regex}$`;
    }
}
