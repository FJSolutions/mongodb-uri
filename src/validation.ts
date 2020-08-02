import * as Utils from './utils'
import * as Types from './types'
import errorMessages from './errors'

const handleError = (throwErrorOnValidation: boolean, errorMessage: string) => {
  if(throwErrorOnValidation) {
    throw new Error(errorMessage)
  }
  else{
    return errorMessage + '\n'
  }
}

const validateHost = (host: Types.HostAddress | undefined, errors: string[], throwErrorOnValidation = false) : boolean =>{
  let isValid = true

  if(Utils.isNullOrUndefined(host)) {
    isValid = false
    errors.push(handleError(throwErrorOnValidation, errorMessages.configHasNoHost))
  }
  else {
    if(Utils.isNullOrEmpty(host?.name)) {
      isValid = false
      errors.push(handleError(throwErrorOnValidation, errorMessages.configHasNoHostName))
    }

    if(Utils.isNullZeroOrNegative(host?.port)) {
      isValid = false
      errors.push(handleError(throwErrorOnValidation, errorMessages.configHasNoHostPort))
    }
  }

  return isValid
}

/**
 * A function that validates the state of a connection URI configuration object.
 *
 * @param config The configuration object to validate
 * @param throwErrorOnValidation A flag to indicate whether to throw errors during validation or collate messages
 * @returns { ValidationResult } An object containing the result of the validation (default false)
 *
 */
export function validateConfig (config: Types.UriConfigContract, throwErrorOnValidation = false) : Types.ValidationResult {
  const errors: string[] = []
  let isValid = true

  if(!config) {
    isValid = false
    errors.push(handleError(throwErrorOnValidation, errorMessages.configNotSupplied))
  }

  // Config name
  if(Utils.isNullOrEmpty(config?.name)) {
    isValid = false
    errors.push(handleError(throwErrorOnValidation, errorMessages.configHasNoName))
  }

  // Protocol
  if(Utils.isNullOrEmpty(config.protocol)) {
    isValid = false
    errors.push(handleError(throwErrorOnValidation, errorMessages.configHasNoProtocol))
  }
  else {
    switch(config.protocol) {
      case 'mongodb':
      case 'mongodb+srv':
        break
      default:
        isValid = false
        errors.push(handleError(throwErrorOnValidation, errorMessages.configHasUnknownProtocol))
        break
    }
  }

  // Host
  if(!validateHost(config?.host, errors, throwErrorOnValidation)){
    isValid = false
  }

  // Credentials
  if(Utils.hasUserNameOrPassword(config)) {
    if(Utils.isNullOrEmpty(config.username) || Utils.isNullOrEmpty(config.password)) {
      isValid = false
      errors.push(handleError(throwErrorOnValidation, errorMessages.configMustHaveBothUserAndPassword))
    }
  }

  // Replica set
  if(!Utils.isNullOrEmpty(config.replicaSet)) {
    config.replicaSet?.forEach(host => {
      if(!validateHost(host, errors, throwErrorOnValidation)) {
        isValid = false
      }
    })
  }

  return { isValid, errors }
}

export default validateConfig
