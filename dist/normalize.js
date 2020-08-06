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
exports.normalizeUri = void 0;
const rfdc_1 = __importDefault(require("rfdc"));
const V = __importStar(require("voca"));
const Types = __importStar(require("./types"));
const Utils = __importStar(require("./utils"));
const errors_1 = __importDefault(require("./errors"));
const validation_1 = __importDefault(require("./validation"));
const builder_1 = require("./builder");
const parser_1 = require("./parser");
const normalizeHost = (hostObj) => {
    if (!hostObj) {
        return undefined;
    }
    if (typeof hostObj === 'string') {
        const hosts = parser_1.parseHosts(hostObj);
        return hosts.hosts[0];
    }
    else {
        const host = { name: Types.MONGO_DB_HOST, port: Types.MONGO_DB_PORT };
        const hostName = hostObj['host'] || hostObj['name'] || hostObj['address'];
        if (!Utils.isNullOrEmpty(hostName)) {
            host.name = hostName;
        }
        if (!Utils.isNullOrEmpty(hostObj['port'])) {
            const portString = hostObj['port'];
            if (V.isNumeric(portString)) {
                host.port = parseInt(portString, 10);
                if (isNaN(host.port)) {
                    throw new Error(errors_1.default.configObjNotPortNotNumeric);
                }
            }
        }
        return host;
    }
};
function normalizeUri(configObj) {
    if (!configObj || Utils.isNullOrUndefined(configObj)) {
        throw new Error(errors_1.default.configObjNotDefined);
    }
    const config = rfdc_1.default({ proto: true })(builder_1.defaultConfig);
    if (configObj['protocol']) {
        config.protocol = configObj['protocol'];
    }
    if (configObj['host']) {
        const host = normalizeHost({ host: configObj['host'], port: configObj['port'] });
        if (host) {
            config.host = host;
        }
    }
    if (configObj['username']) {
        config.username = configObj['username'];
    }
    else if (configObj['user']) {
        config.username = configObj['user'];
    }
    else if (configObj['uid']) {
        config.username = configObj['uid'];
    }
    if (configObj['password']) {
        config.password = configObj['password'];
    }
    if (configObj['database']) {
        config.database = configObj['database'];
    }
    if (Array.isArray(configObj['replicaSet'])) {
        const replicaSet = configObj['replicaSet'];
        config.replicaSet = [];
        replicaSet.forEach(entry => {
            var _a;
            const host = normalizeHost(entry);
            if (host) {
                (_a = config.replicaSet) === null || _a === void 0 ? void 0 : _a.push(host);
            }
        });
        if (config.replicaSet.length === 0) {
            config.replicaSet = undefined;
        }
    }
    if (configObj['options']) {
        const options = {};
        const entries = Object.entries(configObj['options']);
        entries.forEach(e => {
            const key = String(e[0]).toLowerCase();
            switch (key) {
                case 'defaultauthdb':
                case 'authsource':
                    options.authSource = e[1];
                    break;
                case 'appname':
                    options.appName = e[1];
                    break;
                case 'validateoptions':
                    options.validateOptions = e[1];
                    break;
                case 'replicaset':
                    if (!options.readConcern)
                        options.readConcern = {};
                    options.replicaSet = e[1];
                    break;
                case 'ssl':
                case 'tls':
                    if (!options.security)
                        options.security = {};
                    options.security.tls = e[1];
                    break;
                case 'tlsinsecure':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsInsecure = e[1];
                    break;
                case 'tlsallowinvalidcertificates':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsAllowInvalidCertificates = e[1];
                    break;
                case 'tlsallowinvalidhostnames':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsAllowInvalidHostnames = e[1];
                    break;
                case 'tlscafile':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsCAFile = e[1];
                    break;
                case 'tlscertificatekeyfile':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsCertificateKeyFile = e[1];
                    break;
                case 'tlscertificatekeyfilepassword':
                    if (!options.security)
                        options.security = {};
                    options.security.tlsCertificateKeyFilePassword = e[1];
                    break;
                case 'compressors':
                    if (!options.compression)
                        options.compression = {};
                    options.compression.compressors = e[1];
                    break;
                case 'zlibcompressionlevel':
                    if (!options.compression)
                        options.compression = {};
                    options.compression.zlibCompressionLevel = e[1];
                    break;
                case 'autoreconnect':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.autoReconnect = e[1];
                    break;
                case 'connecttimeoutms':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.connectTimeoutMS = e[1];
                    break;
                case 'maxidletimems':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.maxIdleTimeMS = e[1];
                    break;
                case 'maxpoolsize':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.maxPoolSize = e[1];
                    break;
                case 'minpoolsize':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.minPoolSize = e[1];
                    break;
                case 'poolsize':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.poolSize = e[1];
                    break;
                case 'reconnectinterval':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.reconnectInterval = e[1];
                    break;
                case 'reconnecttries':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.reconnectTries = e[1];
                    break;
                case 'waitqueuetimeoutms':
                    if (!options.connections)
                        options.connections = {};
                    options.connections.waitQueueTimeoutMS = e[1];
                    break;
                case 'readconcernlevel':
                    if (!options.readConcern)
                        options.readConcern = {};
                    options.readConcern.readConcernLevel = e[1];
                    break;
                case 'readpreference':
                    if (!options.readConcern)
                        options.readConcern = {};
                    options.readConcern.readPreference = e[1];
                    break;
                case 'retryreads':
                    if (!options.readConcern)
                        options.readConcern = {};
                    options.readConcern.retryReads = e[1];
                    break;
                case 'j':
                case 'journal':
                    if (!options.writeConcerns)
                        options.writeConcerns = {};
                    options.writeConcerns.journal = e[1];
                    break;
                case 'w':
                    if (!options.writeConcerns)
                        options.writeConcerns = {};
                    options.writeConcerns.w = e[1];
                    break;
                case 'wtimeoutms':
                    if (!options.writeConcerns)
                        options.writeConcerns = {};
                    options.writeConcerns.wtimeoutMS = e[1];
                    break;
                case 'retrywrites':
                    if (!options.writeConcerns)
                        options.writeConcerns = {};
                    options.writeConcerns.retryWrites = e[1];
                    break;
                default:
                    throw new Error(errors_1.default.normalizeUnknownOptions + e[0]);
            }
        });
        config.options = options;
    }
    validation_1.default(config, true);
    return config;
}
exports.normalizeUri = normalizeUri;
exports.default = normalizeUri;
