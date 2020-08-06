
/**
 * An object containing the error messages for the MongoDB connection builder
 */
export const errorMessages = {
  get emptyUriString () : string {
    return 'You must supply a MongoDB connection URI!'
  },
  get protocolNotDefined () : string {
    return 'The connection URI is malformed, it must begin with a MongoDB protocol'
  },
  get protocolUnrecognized () : string {
    return 'The MongoDB connection protocol was unrecognized'
  },
  get hostNotDefined () : string {
    return 'A MongoDB host must be supplied'
  },
  get hostMissing () : string {
    return 'The MongoDb host information has not supplied'
  },
  get hostInvalid () : string {
    return 'The MongoDb host information was invalid'
  },
  get hostInvalidAddress () : string {
    return 'The MongoDb host address was not supplied!'
  },
  get hostPortNotANumber () : string {
    return 'The supplied value for the Port isn\'t a valid number'
  },
  get configNotSupplied () : string {
    return 'No configuration object was supplied'
  },
  get configHasNoName () : string {
    return 'The configuration\'s name must be supplied'
  },
  get configHasNoHost () : string {
    return 'The configuration must have a host'
  },
  get configHasNoHostName () : string {
    return 'The configuration host must have a name'
  },
  get configHasNoHostPort () : string {
    return 'The configuration host must have a port number set'
  },
  get configHasNoProtocol () : string {
    return 'The configuration has not protocol set'
  },
  get configHasUnknownProtocol () : string {
    return 'The configuration protocol is unknown'
  },
  get configMustHaveBothUserAndPassword () : string {
    return 'The configuration must have both user name and password if either of them is supplied'
  },
  get configObjNotDefined () : string {
    return 'The configuration object cannot be null or undefined'
  },
  get configObjNotPortNotNumeric () : string {
    return 'The port supplied is not a valid number'
  },
  get normalizeUnknownOptions () : string {
    return 'Unrecognized option: '
  }
}

export default errorMessages
