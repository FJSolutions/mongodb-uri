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
exports.validateConfig = void 0;
const Utils = __importStar(require("./utils"));
const errors_1 = __importDefault(require("./errors"));
const handleError = (throwErrorOnValidation, errorMessage) => {
    if (throwErrorOnValidation) {
        throw new Error(errorMessage);
    }
    else {
        return errorMessage + '\n';
    }
};
const validateHost = (host, errors, throwErrorOnValidation = false) => {
    let isValid = true;
    if (Utils.isNullOrUndefined(host)) {
        isValid = false;
        errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasNoHost));
    }
    else {
        if (Utils.isNullOrEmpty(host === null || host === void 0 ? void 0 : host.name)) {
            isValid = false;
            errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasNoHostName));
        }
        if (Utils.isNullZeroOrNegative(host === null || host === void 0 ? void 0 : host.port)) {
            isValid = false;
            errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasNoHostPort));
        }
    }
    return isValid;
};
function validateConfig(config, throwErrorOnValidation = false) {
    var _a;
    const errors = [];
    let isValid = true;
    if (!config) {
        isValid = false;
        errors.push(handleError(throwErrorOnValidation, errors_1.default.configNotSupplied));
    }
    if (Utils.isNullOrEmpty(config === null || config === void 0 ? void 0 : config.name)) {
        isValid = false;
        errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasNoName));
    }
    if (Utils.isNullOrEmpty(config.protocol)) {
        isValid = false;
        errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasNoProtocol));
    }
    else {
        switch (config.protocol) {
            case 'mongodb':
            case 'mongodb+srv':
                break;
            default:
                isValid = false;
                errors.push(handleError(throwErrorOnValidation, errors_1.default.configHasUnknownProtocol));
                break;
        }
    }
    if (!validateHost(config === null || config === void 0 ? void 0 : config.host, errors, throwErrorOnValidation)) {
        isValid = false;
    }
    if (Utils.hasUserNameOrPassword(config)) {
        if (Utils.isNullOrEmpty(config.username) || Utils.isNullOrEmpty(config.password)) {
            isValid = false;
            errors.push(handleError(throwErrorOnValidation, errors_1.default.configMustHaveBothUserAndPassword));
        }
    }
    if (!Utils.isNullOrEmpty(config.replicaSet)) {
        (_a = config.replicaSet) === null || _a === void 0 ? void 0 : _a.forEach(host => {
            if (!validateHost(host, errors, throwErrorOnValidation)) {
                isValid = false;
            }
        });
    }
    return { isValid, errors };
}
exports.validateConfig = validateConfig;
exports.default = validateConfig;
