export interface Loader {
    Pattern: string;
    Function: (fileLocation: string, contents: string, callback: (abort?: any, results?: string)=> any) => any;
}

export interface LoaderifyOpts {
    loaders?: Loader[];
}