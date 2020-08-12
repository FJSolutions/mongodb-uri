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
import { parseHosts } from './parser'

const normalizeHost = (hostObj: { [key: string]: any } | string) : Types.HostAddress | undefined => {
  if(!hostObj) {
    return undefined
  }

  
  // Host string
  if(typeof hostObj === 'string'){
    const hosts = parseHosts(hostObj as string)
    return hosts.hosts[0]
  }
  else {
    const host: Types.HostAddress = { name: Types.MONGO_DB_HOST, port: Types.MONGO_DB_PORT }

    // The host name can be either 'host', 'name', or 'address'
    const hostName = hostObj['host'] || hostObj['name'] || hostObj['address']
    
    // Validate the host name
    if(!Utils.isNullOrEmpty(hostName)) {
    //   console.log(hostObj);
    //   throw new Error(errorMessages.hostInvalidAddress)
    // }
    // else {
      host.name = hostName
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
}

/**
 * Normalizes the supplied object to a connection URI configuration
 * 
 * @param configObj The object to normalize to a connection URI configuration object 
 */
export function normalizeUri (configObj?: { [key: string]: any }) : Types.UriConfigContract {
  if(!configObj || Utils.isNullOrUndefined(configObj)){
    throw new Error(errorMessages.configObjNotDefined)
  }

  const config: Types.UriConfigContract = Clone({ proto: true })(defaultConfig)

  // Protocol
  if(configObj['protocol']){
    config.protocol = configObj['protocol']
  }

  // Host name
  if(configObj['host']){
    const host = normalizeHost({ host: configObj['host'], port: configObj['port'] })
    if(host){
      config.host = host
    }
  }

  // User name
  if(configObj['username']){
    config.username = configObj['username']
  }
  else if(configObj['user']){
    config.username = configObj['user']
  }
  else if(configObj['uid']){
    config.username = configObj['uid']
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
    const replicaSet = configObj['replicaSet']
    config.replicaSet = []
    replicaSet.forEach(entry => {
      const host = normalizeHost(entry)
      if(host){
        config.replicaSet?.push(host)
      }
    })

    // const result = (configObj['replicaSet'] as { host: string, port: string | number }[])
    //   .map(item => normalizeHost({ host: item.host, port: item.port }))      

    if(config.replicaSet.length === 0) {
      config.replicaSet = undefined
    }
  }

  // Options
  if(configObj['options']){
    const options: Types.UriOptionsContract = {}
    const entries  = Object.entries(configObj['options'])
    
    entries.forEach(e => {
      const key = String(e[0]).toLowerCase()      

      switch(key) {
        case 'defaultauthdb':
        case 'authsource':
          options.authSource = e[1] as string
          break
        case 'appname':
          options.appName = e[1] as string
          break
        case 'validateoptions':
          options.validateOptions = e[1] as boolean 
          break
        case 'replicaset':
          if(!options.readConcern) options.readConcern = {}
          options.replicaSet = e[1] as string
          break
        case 'ssl':
        case 'tls':
          if(!options.encryption) options.encryption = {}
          options.encryption.tls = e[1] as boolean 
          break
        case 'tlsinsecure':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsInsecure = e[1] as boolean 
          break
        case 'tlsallowinvalidcertificates':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsAllowInvalidCertificates = e[1] as boolean
          break
        case 'tlsallowinvalidhostnames':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsAllowInvalidHostnames = e[1] as boolean
          break
        case 'tlscafile':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsCAFile = e[1] as string
          break
        case 'tlscertificatekeyfile':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsCertificateKeyFile = e[1] as string
          break
        case 'tlscertificatekeyfilepassword':
          if(!options.encryption) options.encryption = {}
          options.encryption.tlsCertificateKeyFilePassword = e[1] as string
          break
        case 'compressors':
          if(!options.compression) options.compression = {}
          options.compression.compressors = e[1] as "snappy" | "zlib" | "zstd" | undefined
          break
        case 'zlibcompressionlevel':
          if(!options.compression) options.compression = {}
          options.compression.zlibCompressionLevel = e[1] as number
          break
        case 'autoreconnect':
          if(!options.connections) options.connections = {}
          options.connections.autoReconnect = e[1] as boolean
          break
        case 'connecttimeoutms':
          if(!options.connections) options.connections = {}
          options.connections.connectTimeoutMS = e[1] as number
          break
        case 'maxidletimems':
          if(!options.connections) options.connections = {}
          options.connections.maxIdleTimeMS = e[1] as number
          break
        case 'maxpoolsize':
          if(!options.connections) options.connections = {}
          options.connections.maxPoolSize = e[1] as number
          break
        case 'minpoolsize':
          if(!options.connections) options.connections = {}
          options.connections.minPoolSize = e[1] as number
          break
        case 'poolsize':
          if(!options.connections) options.connections = {}
          options.connections.poolSize = e[1] as number
          break
        case 'reconnectinterval':
          if(!options.connections) options.connections = {}
          options.connections.reconnectInterval = e[1] as number
          break
        case 'reconnecttries':
          if(!options.connections) options.connections = {}
          options.connections.reconnectTries = e[1] as number
          break
        case 'waitqueuetimeoutms':
          if(!options.connections) options.connections = {}
          options.connections.waitQueueTimeoutMS = e[1] as number
          break
        case 'readconcernlevel':
          if(!options.readConcern) options.readConcern = {}
          options.readConcern.readConcernLevel = e[1] as "local" | "majority" | "linearizable" | "available" | undefined
          break
        case 'readpreference':
          if(!options.readConcern) options.readConcern = {}
          options.readConcern.readPreference = e[1] as "primary" | "primaryPreferred" | "secondary" | "secondaryPreferred" | "nearest" | undefined
          break
        case 'retryreads':
          if(!options.readConcern) options.readConcern = {}
          options.readConcern.retryReads = e[1] as boolean
          break
        case 'j':
        case 'journal':
          if(!options.writeConcerns) options.writeConcerns = {}
          options.writeConcerns.journal = e[1] as boolean | undefined
          break
        case 'w':
          if(!options.writeConcerns) options.writeConcerns = {}
          options.writeConcerns.w = e[1] as string | number | undefined
          break
        case 'wtimeoutms':
          if(!options.writeConcerns) options.writeConcerns = {}
          options.writeConcerns.wtimeoutMS = e[1] as number | undefined
          break
        case 'retrywrites':
          if(!options.writeConcerns) options.writeConcerns = {}
          options.writeConcerns.retryWrites = e[1] as boolean
          break
        default:
          throw new Error(errorMessages.normalizeUnknownOptions + e[0])
      }
    })

    config.options = options;
  }

  // Validate the configuration object
  ConfigValidator(config, true)

  return config
}

export default normalizeUri
