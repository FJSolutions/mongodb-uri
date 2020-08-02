/**
 * MongoDB constant values supported by the connection URI parser and builder
 */

export const MONGO_DB_PROTOCOL = 'mongodb';
export const MONGO_DB_SRV_PROTOCOL = 'mongodb+srv';
export const MONGO_DB_HOST = 'localhost';
export const MONGO_DB_PORT = 27017;

export type MongoDbProtocol = 'mongodb' | 'mongodb+srv'

export type Primitive = string | boolean | number

export type KeyPrimitive = { key: string, value: Primitive }

/**
 * Defines the address elements of a MongoDB server
 */
export type HostAddress = {
  /**
   * The DNS name or IP address of the MongoDB server
   */
  name: string,
  /**
   * The MongoDB server Port number to connect on (default = 27017)
   */
  port? : number
}

/**
 * Represents a MongoDB configuration object
 */
export interface UriConfigContract{
  /**
   * The name of this connection configuration
   */
  name?: string
  /**
   * The host address details for a single server MongoDB server
   */
  host?: HostAddress
  /**
   * The user name (uid) to authenticate with
   */
  username?: string
  /**
   * The password to use for authentication
   */
  password?: string
  /**
   * The default database to use
   */
  database?: string
  /**
   * The MongoDB protocol to use
   */
  protocol?: MongoDbProtocol
  /**
   * The array of options to send in the query string of the URI
   */
  options?: Array<KeyPrimitive>
  /**
   * An array of servers to use when connecting to a replica set
   */
  replicaSet?: Array<HostAddress>
}

/**
 * The Options interface for MongoDB URI builder
 */
export interface BuilderOptionsContract {
  /**
   * A flag indicating whether to always append the port to a host name.
   * (default false when the host port is the default MongoDB port = 27017)
   */
  alwaysShowPort?: boolean
}

/**
 * An object that represents the result of validating a URI configuration object
 */
export type ValidationResult = {
  /**
   * A flag indicating is the configuration object is in a valid state
   */
  isValid: boolean,
  /**
   * A list of error messages.
   */
  errors: string[]
}

/**
 * Enumerates known connection URI options
 */
export enum DbOptions {
  AUTH_SOURCE = 'authSource',
  REPLICA_SET_NAME = 'replicaSet',
  SSL = 'ssl',
  TLS = 'tls',
  TLS_CERTIFICATE_KEY_FILE = 'tlsCertificateKeyFile',
  TLS_CERTIFICATE_KEY_FILE_PASSWORD = 'tlsCertificateKeyFilePassword',
  TLS_CERTIFICATE_AUTHORITY_FILE = 'tlsCAFile',
  TLS_ALLOW_INVALID_CERTIFICATES = 'tlsAllowInvalidCertificates',
  TLS_ALLOW_INVALID_HOST_NAMES = 'tlsAllowInvalidHostnames',
  TLS_INSECURE = 'tlsInsecure',
  CONNECTION_TIMEOUT_IN_MILLISECONDS = 'connectTimeoutMS',
  SOCKET_TIMEOUT_IN_MILLISECONDS = 'socketTimeoutMS',
  COMPRESSORS= 'compressors',
  ZLIB_COMPRESSION_LEVEL = 'zlibCompressionLevel',
  MAX_POOL_SIZE = 'maxPoolSize',
  MIN_POOL_SIZE = 'minPoolSize',
  POOL_MAX_IDLE_TIME_IN_MILLISECONDS = 'maxIdleTimeMS',
  POOL_WAIT_QUEUE_MULTIPLE = 'waitQueueMultiple',
  POOL_WAIT_QUEUE_TIMEOUT_IN_MILLISECONDS = 'waitQueueTimeoutMS',
  WRITE_CONCERN = 'w',
  WRITE_CONCERN_TIMEOUT_IN_MILLISECONDS = 'wtimeoutMS',
  WRITE_CONCERN_JOURNAL = 'journal',
  READ_CONCERN_LEVEL = 'readConcernLevel',
  READ_PREFERENCE = 'readPreference',
  RETRY_READS = 'retryReads',
  RETRY_WRITES = 'retryWrites',

}