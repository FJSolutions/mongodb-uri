/* -----------------------------------------------------------------
|
| Functions for normalizing a Connection Configuration Contract from an Object
|
/ ----------------------------------------------------------------- */
import Clone from 'rfdc'
import * as V from 'voca'
import * as Types from './types'
import * as Utils from './utils'
import errorMessages from './errors'
import ConfigValidator from './validation'
import { defaultConfig } from './builder'

const normalizeHost = (hostObj: { [key: string]: any }) : Types.HostAddress | undefined => {
  if(!hostObj){
    return undefined
  }

  const host: Types.HostAddress = { name: Types.MONGO_DB_HOST, port: Types.MONGO_DB_PORT }

  if(Utils.isNullOrEmpty(hostObj['host'])){
    return host
  }
  else{
    host.name = hostObj['host']
  }

  // Host port
  if(!Utils.isNullOrEmpty(hostObj['port'])){
    const portString = hostObj['port']
    if(V.isNumeric(portString)){
      host.port = parseInt(portString, 10)

      if(isNaN(host.port)){
        throw new Error(errorMessages.configObjNotPortNotNumeric)
      }
    }
  }

  return host
}

/**
 * Normalizes the supplied object to a connection URI configuration
 * 
 * @param configObj The object to normalize to a connection URI configuration object 
 */
export function normalize (configObj?: { [key: string]: any }) : Types.UriConfigContract {
  if(!configObj || Utils.isNullOrUndefined(configObj)){
    throw new Error(errorMessages.configObjNotDefined)
  }

  const config: Types.UriConfigContract = Clone({ proto: true })(defaultConfig)

  // Protocol
  if(configObj['protocol']){
    config.protocol = configObj['protocol']
  }

  // Host name
  const host = normalizeHost({ host: configObj['host'], port: configObj['port'] })
  if(host){
    config.host = host
  }

  // User name
  if(configObj['username']){
    config.username = configObj['username']
  }

  // User password
  if(configObj['password']){
    config.password = configObj['password']
  }

  // Database
  if(configObj['database']){
    config.database = configObj['database']
  }

  // Replica Set
  if(Array.isArray(configObj['replicaSet'])){
    const result = (configObj['replicaSet'] as { host: string, port: string | number }[])
      .map(item => normalizeHost({ host: item.host, port: item.port }))      

    if(result.length > 0) {
      config.replicaSet = result as Types.HostAddress[]
    }
  }

  // Options
  if(configObj['options']){
    const optionsObj = configObj['options']
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = Object.entries(configObj['options']).map(([k, _]) => {
      const key = String(k)
      return { key, value: Utils.parsePrimitive(String(optionsObj[key])) }
    })

    if(result){
      config.options = result
    }
  }

  /**
   * Validate the configuration object
   */
  ConfigValidator(config, true)


  return config
}

export default normalize
