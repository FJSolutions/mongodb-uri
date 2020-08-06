import * as Types from './types';
export declare const defaultConfig: Types.UriConfigContract;
export declare class UriBuilder {
    private constructor();
    private static _clone;
    private static _options;
    private static _config;
    static reset(): typeof UriBuilder;
    private static buildHostUri;
    static setBuilderOptions(options: Types.BuilderOptionsContract): typeof UriBuilder;
    static setOptions(options: Types.UriOptionsContract): typeof UriBuilder;
    static setConfig(config: Types.UriConfigContract): typeof UriBuilder;
    static setCredentials(userName: string, password: string, authSource?: string): typeof UriBuilder;
    static setHost(host: string): typeof UriBuilder;
    static setHost(host: Types.HostAddress): typeof UriBuilder;
    static setReplicaSet(replicaSet: Array<string | Types.HostAddress>, name?: string): typeof UriBuilder;
    private static addHost;
    static exportConfig(): Types.UriConfigContract;
    static buildUri(): string;
    static toJSON(): string;
}
