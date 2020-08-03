/* -----------------------------------------------------------------
|
| Utility functions
|
/ ----------------------------------------------------------------- */
import * as V from 'voca'
import * as Types from './types'

/**
 * 
 * @param value Returns false if  the supplied value is a string and is not blank or an array that has at least one element
 */
export const isNullOrEmpty = (value: any | string | null | undefined ) : boolean => {
  if(value) {
    // Strings
    if(typeof value === 'string') {
      // return V.isBlank(value)
      if(value.trim().length > 0) {
        return false
      }
    }

    // Iterables
    // console.log(typeof value['length'] !== 'undefined')
    // if(typeof value['length'] !== 'undefined') {
    if(Array.isArray(value)) {
      if(value.length > 0){
        return false
      }
    }
  }

  return true
}

/**
 * Returns whether a value is undefined, of null
 * 
 * @param value The value to check
 */
export const isNullOrUndefined = (value: any | null | undefined ) : boolean=> {
  if(typeof value === 'undefined'){
    return true
  }
  else if(value === null){
    return true
  }

  return false
}

export const isNullZeroOrNegative = (value: number | null | undefined) : boolean => {
  if(!value) {
    return true
  }
  if(isNaN(value)){
    return true
  }
  if(value <= 0) {
    return true
  }

  return false
}

export const parsePrimitive = (value: string) : Types.Primitive => {
  // Empty value
  if(isNullOrEmpty(value)) {
    return ''
  }

  // Booleans
  const bool = parseBoolean(value)
  if(bool) return bool

  // Numbers
  if(V.isNumeric(value)) {
    return parseFloat(value)
  }

  // String (unescape)
  return decodeURIComponent(value)
}

export const hasUserNameOrPassword = (config: Types.UriConfigContract) : boolean => {
  return !isNullOrEmpty(config.username) || !isNullOrEmpty(config.password)
}

/**
 * Tries to parse a string as a boolean value
 * 
 * @param value the value to parse as a boolean
 */
export const parseBoolean = (value: string) : boolean | undefined => {
  if(!value) return undefined

  switch(value.toLocaleLowerCase()) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return undefined
  }
}