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
 * Defines the interface of the URI configuration object
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
   * An array of servers to use when connecting to a replica set
   */
  replicaSet?: Array<HostAddress>
  /**
   * The set of options to add to the URI query string
   */
  options?: UriOptionsContract
}

/**
 * Defines the interface for the URI connection options
 */
export interface UriOptionsContract {
  /**
   * Define the database to authenticate against.
   * 
   * Specify the database name associated with the user’s credentials. If authSource is unspecified, authSource defaults to the defaultauthdb 
   * specified in the connection string. If defaultauthdb is unspecified, then authSource defaults to admin.
   */
  authSource?: string,
  /**
   * Specifies the name of the replica set, if the mongod is a member of a replica set.
   */
  replicaSet?: string,
  /**
   * Specifies whether to error when the method parameters contain an unknown or incorrect option. If false, the driver produces warnings only. 
   * (default = false)
   */
  validateOptions?: boolean,
  /**
   * The name of the application that created this MongoClient instance. 
   * MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log 
   * and profile collections.
   */
  appName?: string,
  /**
   * An object containing connection related options
   */
  connections?: {
    /**
     * The maximum size of the individual server pool (default = 5)
     */
    poolSize?: number,
    /**
     * The maximum number of connections in the connection pool. The default value is 100.
     */
    maxPoolSize?: number,
    /**
     * If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections. The default value is 0.
     */
    minPoolSize?: number,
    /**
     * The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed.
     */
    maxIdleTimeMS?: number,
    /**
     * The maximum time in milliseconds that a thread can wait for a connection to become available.
     */
    waitQueueTimeoutMS?: number,
    /**
     * Enable autoReconnect for single server instances (default = true)
     */
    autoReconnect?: boolean,
    /**
     * How long to wait for a connection to be established before timing out (default 10_000)
     */
    connectTimeoutMS?: number,
    /**
     * Server attempt to reconnect number of times (default = 30)
     */
    reconnectTries?: number,
    /**
     * Server will wait number of milliseconds between retries (default = 1000)
     */
    reconnectInterval?: number,
  },
  /**
   * An object containing security related options
   */
  security?: {
    /**
     * Enables or disables TLS/SSL for the connection
     * (The tls option is equivalent to the ssl option)
     */
    tls?: boolean,
    /**
     * Specifies the location of a local .pem file that contains either the client’s TLS/SSL X.509 certificate 
     * or the client’s TLS/SSL certificate and key.
     */
    tlsCertificateKeyFile?: string,
    /**
     * Specifies the password to de-crypt the tlsCertificateKeyFile.
     */
    tlsCertificateKeyFilePassword?: string,
    /**
     * Specifies the location of a local .pem file that contains the root certificate chain from the Certificate Authority. 
     * This file is used to validate the certificate presented by the mongod/mongos instance.
     */
    tlsCAFile?: string,
    /**
     * Bypasses validation of the certificates presented by the mongod/mongos instance.
     * Set to true to connect to MongoDB instances even if the server’s present invalid certificates.
     */
    tlsAllowInvalidCertificates?: boolean,
    /**
     * Disables hostname validation of the certificate presented by the mongod/mongos instance.
     * Set to true to connect to MongoDB instances even if the hostname in the server certificates do not match the server’s host.
     */
    tlsAllowInvalidHostnames?: boolean,
    /**
     * Disables various certificate validations.
     * Set to true to disable certificate validations. The exact validatations disabled vary by drivers. Refer to the drivers documentation.
     */
    tlsInsecure?: boolean,
  },
  /**
   * An object containing compression related options
   */
  compression?: {
    /**
     * Comma-delimited string of compressors to enable network compression for communication between this client and a mongod/mongos instance.
     * If you specify multiple compressors, then the order in which you list the compressors matter as well as the communication initiator. 
     * For example, if the client specifies the following network compressors "zlib,snappy" and the mongod specifies "snappy,zlib", messages between the client and the mongod uses zlib.
     * Messages are compressed when both parties enable network compression. Otherwise, messages between the parties are uncompressed.
     * If the parties do not share at least one common compressor, messages between the parties are uncompressed.
     */
    compressors?: 'snappy' | 'zlib' | 'zstd',
    /**
     * An integer that specifies the compression level if using zlib for network compression.
     * You can specify an integer value ranging from -1 to 9:
     * -1	Default compression level, usually level 6 compression.
     * 0	    No compression
     * 1 - 9	Increasing level of compression but at the cost of speed, with:
     *        1 = providing the best speed but least compression, and
     *        9 = providing the best compression but at the slowest speed.
     */
    zlibCompressionLevel?: number,
  },
  /**
   * An object containing write concern options
   */
  writeConcerns?: {
    /**
     * Corresponds to the write concern w Option. The w option requests acknowledgement that the write operation has propagated to a 
     * specified number of mongod instances or to mongod instances with specified tags.
     * You can specify a number, the string majority, or a tag set.
     */
    w?:  number | 'majority' | string,
    /**
     * Corresponds to the write concern wtimeout. wtimeoutMS specifies a time limit, in milliseconds, for the write concern.
     * When wtimeoutMS is 0, write operations will never time out.
     */
    wtimeoutMS?: number,
    /**
     * Corresponds to the write concern j Option option. The journal option requests acknowledgement from MongoDB 
     * that the write operation has been written to the journal. For details, see j Option.
     * If you set journal to true, and specify a w value less than 1, journal prevails.
     * If you set journal to true, and the mongod does not have journaling enabled, as with storage.journal.enabled, then MongoDB will error.
     */
    journal?: boolean,
    /**
     * Enable retryable writes.
     */
    retryWrites?: boolean
  },
  /**
   * An object containing read concern options
   */
  readConcern?: {
    /**
     * The level of isolation
     */
    readConcernLevel?: 'local' | 'majority' | 'linearizable' | 'available',
    /**
     * Specifies the read preferences for this connection. (default = primary)
     */
    readPreference?: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest',
    /**
     * Enables retryable reads.
     */
    retryReads?: boolean
  },
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
