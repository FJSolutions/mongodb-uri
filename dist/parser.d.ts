import * as Types from './types';
export declare const parseHosts: (connectionUri: string) => {
    isSingle: boolean;
    hosts: Array<Types.HostAddress>;
};
export declare function parseUri(connectionUri: string): Types.UriConfigContract;
