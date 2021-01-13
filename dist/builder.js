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
exports.UriBuilder = exports.defaultConfig = void 0;
const rfdc_1 = __importDefault(require("rfdc"));
const Types = __importStar(require("./types"));
const Utils = __importStar(require("./utils"));
const validation_1 = __importDefault(require("./validation"));
const parser_1 = require("./parser");
exports.defaultConfig = {
    name: "Default",
    host: {
        name: Types.MONGO_DB_HOST,
        port: Types.MONGO_DB_PORT,
    },
    protocol: Types.MONGO_DB_PROTOCOL,
};
const defaultBuildOptions = {
    alwaysShowPort: false,
};
class UriBuilder {
    constructor() { }
    static reset() {
        this._options = this._clone(defaultBuildOptions);
        this._config = this._clone(exports.defaultConfig);
        this._config.options = {};
        this._config.replicaSet = [];
        return this;
    }
    static fromUri(uri) {
        this.setConfig(parser_1.parseUri(uri));
        return this;
    }
    static buildHostUri(host, showPort = true) {
        let hostString = host.name;
        if (host.port !== Types.MONGO_DB_PORT || showPort) {
            hostString += `:${host.port}`;
        }
        return hostString;
    }
    static setBuilderOptions(options) {
        this._options = {
            ...this._clone(defaultBuildOptions),
            ...this._clone(options),
        };
        return this;
    }
    static setOptions(options) {
        this._config.options = { ...this._config.options, ...this._clone(options) };
        return this;
    }
    static setConfig(config) {
        this._config = { ...this._clone(exports.defaultConfig), ...this._clone(config) };
        validation_1.default(this._config, true);
        return this;
    }
    static setCredentials(userName, password, authSource) {
        this._config.username = userName;
        this._config.password = password;
        if (authSource) {
            this._config.options = { ...this._config.options, authSource };
        }
        return this;
    }
    static setHost(host) {
        if (typeof host === "string") {
            if (this._config.host) {
                this._config.host.name = host;
            }
            else {
                this._config.host = { name: host };
            }
        }
        else {
            this._config.host = host;
        }
        if (this._config.host && !this._config.host.port) {
            this._config.host.port = Types.MONGO_DB_PORT;
        }
        return this;
    }
    static setProtocol(protocol) {
        this._config.protocol = protocol;
        return this;
    }
    static setDatabase(dbName) {
        this._config.database = dbName;
        return this;
    }
    static setReplicaSet(replicaSet, name) {
        if (replicaSet) {
            replicaSet.forEach((host) => {
                if (typeof host === "string") {
                    this.addHost(host);
                }
                else {
                    this.addHost(host);
                }
            });
        }
        if (name) {
            this._config.options = { ...this._config.options, replicaSet: name };
        }
        return this;
    }
    static addHost(host, removeDefaultHost = true) {
        var _a, _b;
        if (removeDefaultHost) {
            this._config.host = undefined;
        }
        if (typeof host === "string") {
            (_a = this._config.replicaSet) === null || _a === void 0 ? void 0 : _a.push({ name: host, port: Types.MONGO_DB_PORT });
        }
        else {
            (_b = this._config.replicaSet) === null || _b === void 0 ? void 0 : _b.push(host);
        }
        return this;
    }
    static exportConfig() {
        return this._clone(this._config);
    }
    static buildUri() {
        var _a;
        let uriString = `${this._config.protocol}://`;
        if (Utils.hasUserNameOrPassword(this._config)) {
            uriString += `${encodeURIComponent(this._config.username || "")}:${encodeURIComponent(this._config.password || "")}@`;
        }
        if (this._config.host && Utils.isNullOrEmpty(this._config.replicaSet)) {
            uriString += this.buildHostUri(this._config.host, this._options.alwaysShowPort);
        }
        if (!Utils.isNullOrEmpty(this._config.replicaSet)) {
            uriString += (_a = this._config.replicaSet) === null || _a === void 0 ? void 0 : _a.map((host) => this.buildHostUri(host, this._options.alwaysShowPort)).join(";");
        }
        if (!Utils.isNullOrEmpty(this._config.database)) {
            uriString += `/${this._config.database}`;
        }
        if (this._config.options) {
            const entries = Object.entries(this._config.options);
            if (entries.length > 0) {
                uriString += Utils.isNullOrEmpty(this._config.database) ? "/?" : "?";
                entries.forEach((e) => {
                    const value = e[1];
                    if (typeof value === "object") {
                        Object.entries(value).forEach((sv) => {
                            uriString += `${sv[0]}=${sv[1]}&`;
                        });
                    }
                    else
                        uriString += `${e[0]}=${value}&`;
                });
                uriString = uriString.slice(0, -1);
            }
        }
        this.reset();
        return uriString;
    }
    static toJSON() {
        return JSON.stringify(this._config, (k, v) => {
            if (JSON.stringify(v) === "{}")
                return undefined;
            else if (Array.isArray(v) && v.every((o) => JSON.stringify(o) === "{}"))
                return undefined;
            else
                return v;
        });
    }
}
exports.UriBuilder = UriBuilder;
UriBuilder._clone = rfdc_1.default({ proto: true });
UriBuilder._options = UriBuilder._clone(defaultBuildOptions);
UriBuilder.reset();
