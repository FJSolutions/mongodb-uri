export declare const MONGO_DB_PROTOCOL = "mongodb";
export declare const MONGO_DB_SRV_PROTOCOL = "mongodb+srv";
export declare const MONGO_DB_HOST = "localhost";
export declare const MONGO_DB_PORT = 27017;
export declare type MongoDbProtocol = 'mongodb' | 'mongodb+srv';
export declare type Primitive = string | boolean | number;
export declare type KeyPrimitive = {
    key: string;
    value: Primitive;
};
export declare type HostAddress = {
    name: string;
    port?: number;
};
export interface UriConfigContract {
    name?: string;
    host?: HostAddress;
    username?: string;
    password?: string;
    database?: string;
    protocol?: MongoDbProtocol;
    replicaSet?: Array<HostAddress>;
    options?: UriOptionsContract;
}
export interface UriOptionsContract {
    authSource?: string;
    replicaSet?: string;
    validateOptions?: boolean;
    appName?: string;
    connections?: {
        poolSize?: number;
        maxPoolSize?: number;
        minPoolSize?: number;
        maxIdleTimeMS?: number;
        waitQueueTimeoutMS?: number;
        autoReconnect?: boolean;
        connectTimeoutMS?: number;
        reconnectTries?: number;
        reconnectInterval?: number;
    };
    security?: {
        tls?: boolean;
        tlsCertificateKeyFile?: string;
        tlsCertificateKeyFilePassword?: string;
        tlsCAFile?: string;
        tlsAllowInvalidCertificates?: boolean;
        tlsAllowInvalidHostnames?: boolean;
        tlsInsecure?: boolean;
    };
    compression?: {
        compressors?: 'snappy' | 'zlib' | 'zstd';
        zlibCompressionLevel?: number;
    };
    writeConcerns?: {
        w?: number | 'majority' | string;
        wtimeoutMS?: number;
        journal?: boolean;
        retryWrites?: boolean;
    };
    readConcern?: {
        readConcernLevel?: 'local' | 'majority' | 'linearizable' | 'available';
        readPreference?: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';
        retryReads?: boolean;
    };
}
export interface BuilderOptionsContract {
    alwaysShowPort?: boolean;
}
export declare type ValidationResult = {
    isValid: boolean;
    errors: string[];
};
