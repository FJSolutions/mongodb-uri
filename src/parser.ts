/* -----------------------------------------------------------------
|
| Functions for parsing a connection URI string
|
/ ----------------------------------------------------------------- */
import * as V from 'voca'
import Clone from 'rfdc'
import errorMessages from './errors'
import * as Types from './types'
import * as Utils from './utils'

/**
 * The default configuration options for a connection URI
 */
const defaultConfig: Types.UriConfigContract = {
  name: 'Default',
  host: {
    name: Types.MONGO_DB_HOST,
    port: Types.MONGO_DB_PORT,
  },
  protocol: Types.MONGO_DB_PROTOCOL,
}

/**
 * Parses the credentials from the beginning of the remaining MongoDB connection URI
 *
 * @param connectionUri The remains of the MongoDB connection URI
 */
const parseCredentials = (connectionUri: string) : {
  uid: string | undefined,
  pwd: string | undefined,
  tail: string
} => {
  if(V.includes(connectionUri, '@')) {
    const [credentials, tail] = connectionUri.split('@')
    let [uid, pwd] = credentials.split(':')

    uid = decodeURIComponent(uid)
    pwd = decodeURIComponent(pwd)

    return { uid, pwd, tail }
  }

  return { uid: undefined, pwd: undefined, tail: connectionUri }
}

/**
 * Parses the database and options from the path part of the remaining MOngoDB connection URI
 *
 * @param connectionUri The remains of the MongoDB connection URI
 */
const parseDbAndOptions = (connectionString: string) : { database: string | undefined, options: Types.UriOptionsContract, tail: string} => {
  const options: Types.UriOptionsContract = {}
  let database: string | undefined
  const [head, uriPath] = connectionString.split('/')

  if(uriPath){
    const [db, optionsString] = uriPath.split('?')
    database = db

    if(optionsString){
      const arrayPairs = optionsString.split('&')
      for(const o of arrayPairs) {
        const kvp = o.split('=')
        
        const key = String(kvp[0]).toLowerCase()

        switch(key) {
          case 'defaultauthdb':
          case 'authdb':
          case 'authsource':
            options.authSource = decodeURIComponent(kvp[1])
            break
          case 'appname':
            options.appName = decodeURIComponent(kvp[1])
            break
          case 'validateoptions':
            options.validateOptions = Utils.parseBoolean(kvp[1])
            break
          case 'replicaset':
            if(!options.readConcern) options.readConcern = {}
            options.replicaSet = decodeURIComponent(kvp[1])
            break
          case 'ssl':
          case 'tls':
            if(!options.security) options.security = {}
            options.security.tls = Utils.parseBoolean(kvp[1])
            break
          case 'tlsinsecure':
            if(!options.security) options.security = {}
            options.security.tlsInsecure = Utils.parseBoolean(kvp[1])
            break
          case 'tlsallowinvalidcertificates':
            if(!options.security) options.security = {}
            options.security.tlsAllowInvalidCertificates = Utils.parseBoolean(kvp[1])
            break
          case 'tlsallowinvalidhostnames':
            if(!options.security) options.security = {}
            options.security.tlsAllowInvalidHostnames = Utils.parseBoolean(kvp[1])
            break
          case 'tlscafile':
            if(!options.security) options.security = {}
            options.security.tlsCAFile = decodeURIComponent(kvp[1])
            break
          case 'tlscertificatekeyfile':
            if(!options.security) options.security = {}
            options.security.tlsCertificateKeyFile = decodeURIComponent(kvp[1])
            break
          case 'tlscertificatekeyfilepassword':
            if(!options.security) options.security = {}
            options.security.tlsCertificateKeyFilePassword = decodeURIComponent(kvp[1])
            break
          case 'compressors':
            if(!options.compression) options.compression = {}
            options.compression.compressors = kvp[1] as "snappy" | "zlib" | "zstd" | undefined
            break
          case 'zlibcompressionlevel':
            if(!options.compression) options.compression = {}
            options.compression.zlibCompressionLevel = parseInt(kvp[1], 10)
            break
          case 'autoreconnect':
            if(!options.connections) options.connections = {}
            options.connections.autoReconnect = Utils.parseBoolean(kvp[1])
            break
          case 'connecttimeoutms':
            if(!options.connections) options.connections = {}
            options.connections.connectTimeoutMS = parseInt(kvp[1], 10)
            break
          case 'maxidletimems':
            if(!options.connections) options.connections = {}
            options.connections.maxIdleTimeMS = parseInt(kvp[1], 10)
            break
          case 'maxpoolsize':
            if(!options.connections) options.connections = {}
            options.connections.maxPoolSize = parseInt(kvp[1], 10)
            break
          case 'minpoolsize':
            if(!options.connections) options.connections = {}
            options.connections.minPoolSize = parseInt(kvp[1], 10)
            break
          case 'poolsize':
            if(!options.connections) options.connections = {}
            options.connections.poolSize = parseInt(kvp[1], 10)
            break
          case 'reconnectinterval':
            if(!options.connections) options.connections = {}
            options.connections.reconnectInterval = parseInt(kvp[1], 10)
            break
          case 'reconnecttries':
            if(!options.connections) options.connections = {}
            options.connections.reconnectTries = parseInt(kvp[1], 10)
            break
          case 'waitqueuetimeoutms':
            if(!options.connections) options.connections = {}
            options.connections.waitQueueTimeoutMS = parseInt(kvp[1], 10)
            break
          case 'readconcernlevel':
            if(!options.readConcern) options.readConcern = {}
            options.readConcern.readConcernLevel = kvp[1] as "local" | "majority" | "linearizable" | "available" | undefined
            break
          case 'readpreference':
            if(!options.readConcern) options.readConcern = {}
            options.readConcern.readPreference = kvp[1] as "primary" | "primaryPreferred" | "secondary" | "secondaryPreferred" | "nearest" | undefined
            break
          case 'retryreads':
            if(!options.readConcern) options.readConcern = {}
            options.readConcern.retryReads = Utils.parseBoolean(kvp[1])
            break
          case 'j':
          case 'journal':
            if(!options.writeConcerns) options.writeConcerns = {}
            options.writeConcerns.journal = Utils.parseBoolean(kvp[1])
            break
          case 'w':
            if(!V.isBlank(kvp[1])) {
              if(!options.writeConcerns) options.writeConcerns = {}
              if(V.isNumeric(kvp[1]))
                options.writeConcerns.w = parseInt(kvp[1], 10)
              else
                options.writeConcerns.w = decodeURIComponent(kvp[1])
            }
            break
          case 'wtimeoutms':
            if(!options.writeConcerns) options.writeConcerns = {}
            options.writeConcerns.wtimeoutMS = parseInt(kvp[1], 10)
            break
          case 'retrywrites':
            if(!options.writeConcerns) options.writeConcerns = {}
            options.writeConcerns.retryWrites = Utils.parseBoolean(kvp[1])
            break
          default:
            throw new Error(errorMessages.normalizeUnknownOptions + kvp[0])
        }
      }
    }
  }

  return { database, options, tail: head }
}

/**
 * Parses the hosts from the remaining MOngoDB connection URI
 *
 * @param connectionUri The remains of the MongoDB connection URI
 */
const parseHosts = (connectionUri: string) : { isSingle: boolean, hosts: Array<Types.HostAddress>} => {
  if(Utils.isNullOrEmpty(connectionUri)) {
    throw new Error(errorMessages.hostNotDefined)
  }

  const hosts: Array<Types.HostAddress> = []
  const hostsString = connectionUri.split(',')
  for(const h of hostsString) {
    const hp = h.split(':')
    if(hp.length === 0){
      throw new Error(errorMessages.hostNotDefined)
    }
    else if(hp.length === 1){
      hosts.push({ name: hp[0], port: Types.MONGO_DB_PORT })
    }
    else if(hp.length === 2) {
      const port = parseInt(hp[1], 10)
      if(isNaN(port)) {
        throw new Error(errorMessages.hostPortNotANumber)
      }

      hosts.push({ name: hp[0], port })
    }
    else{
      throw new Error(errorMessages.hostInvalid)
    }
  }

  return { isSingle: hosts.length === 1, hosts }
}

/**
 * For parsing the protocol from a MongoDB connection URI and returning the protocol and the reset of the URI string
 *
 * @param connectionUri The MongoDB connection URI
 */
const parseProtocol = (connectionUri: string) : {protocol:Types.MongoDbProtocol, tail:string} => {
  const index = connectionUri.indexOf('//')
  if(index < 0) {
    throw new Error(errorMessages.protocolNotDefined)
  }

  const [protocolString, tail] = connectionUri.split('://')
  let protocol: Types.MongoDbProtocol
  switch(protocolString){
    case Types.MONGO_DB_PROTOCOL:
      protocol = 'mongodb'
      break
    case Types.MONGO_DB_SRV_PROTOCOL:
      protocol = 'mongodb+srv'
      break
    default:
      throw new Error(errorMessages.protocolUnrecognized)
  }

  if(tail?.trim().length === 0) {
    throw new Error(errorMessages.hostNotDefined)
  }

  return { protocol, tail }
}

/**
 * Parses a MongoDB URI string and returns a configuration object
 *
 * @param connectionUri The mongoDB connection URI string
 */
export function parseUri (connectionUri: string) : Types.UriConfigContract {
  if(Utils.isNullOrEmpty(connectionUri)){
    throw new Error(errorMessages.emptyUriString)
  }

  // Protocol
  const protocolResult = parseProtocol(connectionUri)

  // UID & password
  const credentialsResult = parseCredentials(protocolResult.tail)

  // Default database & options
  const dbResult = parseDbAndOptions(credentialsResult.tail)

  // Host(s) & ports
  const hostResult = parseHosts(dbResult.tail)

  // Return a configuration object with the parsed details
  return { ...Clone({ proto: true })(defaultConfig), ...{
      protocol: protocolResult.protocol,
      username: credentialsResult.uid,
      password: credentialsResult.pwd,
      database: dbResult.database,
      options: dbResult.options,
      host: hostResult.isSingle ? hostResult.hosts[0] : undefined,
      replicaSet: hostResult.isSingle ? undefined : hostResult.hosts,
    },
  }
}
