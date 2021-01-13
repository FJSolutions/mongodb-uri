"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoolean = exports.hasUserNameOrPassword = exports.parsePrimitive = exports.isNullZeroOrNegative = exports.isNullOrUndefined = exports.isNullOrEmpty = void 0;
const voca_1 = __importDefault(require("voca"));
exports.isNullOrEmpty = (value) => {
    if (value) {
        if (typeof value === "string") {
            if (value.trim().length > 0) {
                return false;
            }
        }
        if (Array.isArray(value)) {
            if (value.length > 0) {
                return false;
            }
        }
    }
    return true;
};
exports.isNullOrUndefined = (value) => {
    if (typeof value === "undefined") {
        return true;
    }
    else if (value === null) {
        return true;
    }
    return false;
};
exports.isNullZeroOrNegative = (value) => {
    if (!value) {
        return true;
    }
    if (isNaN(value)) {
        return true;
    }
    if (value <= 0) {
        return true;
    }
    return false;
};
exports.parsePrimitive = (value) => {
    if (exports.isNullOrEmpty(value)) {
        return "";
    }
    const bool = exports.parseBoolean(value);
    if (bool)
        return bool;
    if (voca_1.default.isNumeric(value)) {
        return parseFloat(value);
    }
    return decodeURIComponent(value);
};
exports.hasUserNameOrPassword = (config) => {
    return !exports.isNullOrEmpty(config.username) || !exports.isNullOrEmpty(config.password);
};
exports.parseBoolean = (value) => {
    if (!value)
        return undefined;
    switch (value.toLocaleLowerCase()) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return undefined;
    }
};
