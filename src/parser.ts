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
const parseDbAndOptions = (connectionString: string) : {
  database: string | undefined,
  options: Array<Types.KeyPrimitive>,
  tail: string
} => {
  let database: string | undefined
  const options: Array<Types.KeyPrimitive> = []

  const [tail, uriPath] = connectionString.split('/')

  if(uriPath){
    const [db, optionsString] = uriPath.split('?')
    database = db

    if(optionsString){
      const arrayPairs = optionsString.split('&')
      for(const o of arrayPairs) {
        const kvp = o.split('=')
        const value = Utils.parsePrimitive(kvp[1])
        options.push({ key: kvp[0], value })
      }
    }
  }

  return { database, options, tail }
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
