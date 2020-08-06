"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = void 0;
exports.errorMessages = {
    get emptyUriString() {
        return 'You must supply a MongoDB connection URI!';
    },
    get protocolNotDefined() {
        return 'The connection URI is malformed, it must begin with a MongoDB protocol';
    },
    get protocolUnrecognized() {
        return 'The MongoDB connection protocol was unrecognized';
    },
    get hostNotDefined() {
        return 'A MongoDB host must be supplied';
    },
    get hostMissing() {
        return 'The MongoDb host information has not supplied';
    },
    get hostInvalid() {
        return 'The MongoDb host information was invalid';
    },
    get hostInvalidAddress() {
        return 'The MongoDb host address was not supplied!';
    },
    get hostPortNotANumber() {
        return 'The supplied value for the Port isn\'t a valid number';
    },
    get configNotSupplied() {
        return 'No configuration object was supplied';
    },
    get configHasNoName() {
        return 'The configuration\'s name must be supplied';
    },
    get configHasNoHost() {
        return 'The configuration must have a host';
    },
    get configHasNoHostName() {
        return 'The configuration host must have a name';
    },
    get configHasNoHostPort() {
        return 'The configuration host must have a port number set';
    },
    get configHasNoProtocol() {
        return 'The configuration has not protocol set';
    },
    get configHasUnknownProtocol() {
        return 'The configuration protocol is unknown';
    },
    get configMustHaveBothUserAndPassword() {
        return 'The configuration must have both user name and password if either of them is supplied';
    },
    get configObjNotDefined() {
        return 'The configuration object cannot be null or undefined';
    },
    get configObjNotPortNotNumeric() {
        return 'The port supplied is not a valid number';
    },
    get normalizeUnknownOptions() {
        return 'Unrecognized option: ';
    }
};
exports.default = exports.errorMessages;
