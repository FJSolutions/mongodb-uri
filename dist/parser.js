"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUri = exports.parseHosts = void 0;
const V = __importStar(require("voca"));
const rfdc_1 = __importDefault(require("rfdc"));
const errors_1 = __importDefault(require("./errors"));
const Types = __importStar(require("./types"));
const Utils = __importStar(require("./utils"));
const defaultConfig = {
    name: 'Default',
    host: {
        name: Types.MONGO_DB_HOST,
        port: Types.MONGO_DB_PORT,
    },
    protocol: Types.MONGO_DB_PROTOCOL,
};
const parseCredentials = (connectionUri) => {
    if (V.includes(connectionUri, '@')) {
        const [credentials, tail] = connectionUri.split('@');
        let [uid, pwd] = credentials.split(':');
        uid = decodeURIComponent(uid);
        pwd = decodeURIComponent(pwd);
        return { uid, pwd, tail };
    }
    return { uid: undefined, pwd: undefined, tail: connectionUri };
};
const parseDbAndOptions = (connectionString) => {
    const options = {};
    let database;
    const [head, uriPath] = connectionString.split('/');
    if (uriPath) {
        const [db, optionsString] = uriPath.split('?');
        database = db;
        if (optionsString) {
            const arrayPairs = optionsString.split('&');
            for (const o of arrayPairs) {
                const kvp = o.split('=');
                const key = String(kvp[0]).toLowerCase();
                switch (key) {
                    case 'defaultauthdb':
                    case 'authdb':
                    case 'authsource':
                        options.authSource = decodeURIComponent(kvp[1]);
                        break;
                    case 'appname':
                        options.appName = decodeURIComponent(kvp[1]);
                        break;
                    case 'validateoptions':
                        options.validateOptions = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'replicaset':
                        if (!options.readConcern)
                            options.readConcern = {};
                        options.replicaSet = decodeURIComponent(kvp[1]);
                        break;
                    case 'ssl':
                    case 'tls':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tls = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'tlsinsecure':
                    case 'sslinsecure':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsInsecure = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'tlsallowinvalidcertificates':
                    case 'sslallowinvalidcertificates':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsAllowInvalidCertificates = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'tlsallowinvalidhostnames':
                    case 'sslallowinvalidhostnames':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsAllowInvalidHostnames = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'tlscafile':
                    case 'sslcafile':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsCAFile = decodeURIComponent(kvp[1]);
                        break;
                    case 'tlscertificatekeyfile':
                    case 'sslcertificatekeyfile':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsCertificateKeyFile = decodeURIComponent(kvp[1]);
                        break;
                    case 'tlscertificatekeyfilepassword':
                    case 'sslcertificatekeyfilepassword':
                        if (!options.encryption)
                            options.encryption = {};
                        options.encryption.tlsCertificateKeyFilePassword = decodeURIComponent(kvp[1]);
                        break;
                    case 'compressors':
                        if (!options.compression)
                            options.compression = {};
                        options.compression.compressors = kvp[1];
                        break;
                    case 'zlibcompressionlevel':
                        if (!options.compression)
                            options.compression = {};
                        options.compression.zlibCompressionLevel = parseInt(kvp[1], 10);
                        break;
                    case 'autoreconnect':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.autoReconnect = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'connecttimeoutms':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.connectTimeoutMS = parseInt(kvp[1], 10);
                        break;
                    case 'maxidletimems':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.maxIdleTimeMS = parseInt(kvp[1], 10);
                        break;
                    case 'maxpoolsize':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.maxPoolSize = parseInt(kvp[1], 10);
                        break;
                    case 'minpoolsize':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.minPoolSize = parseInt(kvp[1], 10);
                        break;
                    case 'poolsize':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.poolSize = parseInt(kvp[1], 10);
                        break;
                    case 'reconnectinterval':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.reconnectInterval = parseInt(kvp[1], 10);
                        break;
                    case 'reconnecttries':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.reconnectTries = parseInt(kvp[1], 10);
                        break;
                    case 'waitqueuetimeoutms':
                        if (!options.connections)
                            options.connections = {};
                        options.connections.waitQueueTimeoutMS = parseInt(kvp[1], 10);
                        break;
                    case 'readconcernlevel':
                        if (!options.readConcern)
                            options.readConcern = {};
                        options.readConcern.readConcernLevel = kvp[1];
                        break;
                    case 'readpreference':
                        if (!options.readConcern)
                            options.readConcern = {};
                        options.readConcern.readPreference = kvp[1];
                        break;
                    case 'retryreads':
                        if (!options.readConcern)
                            options.readConcern = {};
                        options.readConcern.retryReads = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'j':
                    case 'journal':
                        if (!options.writeConcerns)
                            options.writeConcerns = {};
                        options.writeConcerns.journal = Utils.parseBoolean(kvp[1]);
                        break;
                    case 'w':
                        if (!V.isBlank(kvp[1])) {
                            if (!options.writeConcerns)
                                options.writeConcerns = {};
                            if (V.isNumeric(kvp[1]))
                                options.writeConcerns.w = parseInt(kvp[1], 10);
                            else
                                options.writeConcerns.w = decodeURIComponent(kvp[1]);
                        }
                        break;
                    case 'wtimeoutms':
                        if (!options.writeConcerns)
                            options.writeConcerns = {};
                        options.writeConcerns.wtimeoutMS = parseInt(kvp[1], 10);
                        break;
                    case 'retrywrites':
                        if (!options.writeConcerns)
                            options.writeConcerns = {};
                        options.writeConcerns.retryWrites = Utils.parseBoolean(kvp[1]);
                        break;
                    default:
                        throw new Error(errors_1.default.normalizeUnknownOptions + kvp[0]);
                }
            }
        }
    }
    return { database, options, tail: head };
};
exports.parseHosts = (connectionUri) => {
    if (Utils.isNullOrEmpty(connectionUri)) {
        throw new Error(errors_1.default.hostNotDefined);
    }
    const hosts = [];
    const hostsString = connectionUri.split(',');
    for (const h of hostsString) {
        const hp = h.split(':');
        if (hp.length === 0) {
            throw new Error(errors_1.default.hostNotDefined);
        }
        else if (hp.length === 1) {
            hosts.push({ name: hp[0], port: Types.MONGO_DB_PORT });
        }
        else if (hp.length === 2) {
            const port = parseInt(hp[1], 10);
            if (isNaN(port)) {
                throw new Error(errors_1.default.hostPortNotANumber);
            }
            hosts.push({ name: hp[0], port });
        }
        else {
            throw new Error(errors_1.default.hostInvalid);
        }
    }
    return { isSingle: hosts.length === 1, hosts };
};
const parseProtocol = (connectionUri) => {
    const index = connectionUri.indexOf('//');
    if (index < 0) {
        throw new Error(errors_1.default.protocolNotDefined);
    }
    const [protocolString, tail] = connectionUri.split('://');
    let protocol;
    switch (protocolString) {
        case Types.MONGO_DB_PROTOCOL:
            protocol = 'mongodb';
            break;
        case Types.MONGO_DB_SRV_PROTOCOL:
            protocol = 'mongodb+srv';
            break;
        default:
            throw new Error(errors_1.default.protocolUnrecognized);
    }
    if ((tail === null || tail === void 0 ? void 0 : tail.trim().length) === 0) {
        throw new Error(errors_1.default.hostNotDefined);
    }
    return { protocol, tail };
};
function parseUri(connectionUri) {
    if (Utils.isNullOrEmpty(connectionUri)) {
        throw new Error(errors_1.default.emptyUriString);
    }
    const protocolResult = parseProtocol(connectionUri);
    const credentialsResult = parseCredentials(protocolResult.tail);
    const dbResult = parseDbAndOptions(credentialsResult.tail);
    const hostResult = exports.parseHosts(dbResult.tail);
    return { ...rfdc_1.default({ proto: true })(defaultConfig), ...{
            protocol: protocolResult.protocol,
            username: credentialsResult.uid,
            password: credentialsResult.pwd,
            database: dbResult.database,
            options: dbResult.options,
            host: hostResult.isSingle ? hostResult.hosts[0] : undefined,
            replicaSet: hostResult.isSingle ? undefined : hostResult.hosts,
        },
    };
}
exports.parseUri = parseUri;
