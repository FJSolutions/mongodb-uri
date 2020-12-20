/**
 *
 * Protocol format from the MongoDB site (https://docs.mongodb.com/manual/reference/connection-string/)
 *
 * mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultAuthDb][?options]]
 *
 */

import Clone from "rfdc";
import * as Types from "./types";
import * as Utils from "./utils";
import ConfigValidator from "./validation";

/**
 * The default configuration options for a connection URI
 */
export const defaultConfig: Types.UriConfigContract = {
  name: "Default",
  host: {
    name: Types.MONGO_DB_HOST,
    port: Types.MONGO_DB_PORT,
  },
  protocol: Types.MONGO_DB_PROTOCOL,
};

/**
 * The default builder options for the connection URI builder
 */
const defaultBuildOptions: Types.BuilderOptionsContract = {
  alwaysShowPort: false,
};

/* -----------------------------------------------------------------
|
| Functions for building a connection URI string from a configuration object
|
/ ----------------------------------------------------------------- */

/**
 * A static builder object for creating MongoDB connection URIs
 */
export class UriBuilder {
  /**
   * The constructor is private tp prevent instantiation
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private static _clone = Clone({ proto: true });
  private static _options = UriBuilder._clone(defaultBuildOptions);
  private static _config: Types.UriConfigContract; // = Clone({ proto: true })(defaultConfig)

  /**
   * Resets all the build-in settings to their default values
   * (Called automatically when `buildUri()` is invoked )
   */
  public static reset(): typeof UriBuilder {
    this._options = this._clone(defaultBuildOptions);
    this._config = this._clone(defaultConfig);

    this._config.options = {};
    this._config.replicaSet = [];

    return this;
  }

  // Internal utility method for building the host part of URI connection strings
  private static buildHostUri(host: Types.HostAddress, showPort = true) {
    let hostString = host.name;

    if (host.port !== Types.MONGO_DB_PORT || showPort) {
      hostString += `:${host.port}`;
    }

    return hostString;
  }

  /**
   * Overrides the default builder options with those supplied
   *
   * @param options the options object to use as an override
   * @returns This builder for chaining purposes
   */
  public static setBuilderOptions(
    options: Types.BuilderOptionsContract
  ): typeof UriBuilder {
    this._options = {
      ...this._clone(defaultBuildOptions),
      ...this._clone(options),
    };

    return this;
  }

  /**
   * Sets connection URI options
   *
   * @param options An object containing the options to set
   */
  public static setOptions(
    options: Types.UriOptionsContract
  ): typeof UriBuilder {
    this._config.options = { ...this._config.options, ...this._clone(options) };

    return this;
  }

  /**
   * Sets the configuration object to use for building the connection string
   *
   * @param config The configuration to use
   */
  public static setConfig(config: Types.UriConfigContract): typeof UriBuilder {
    this._config = { ...this._clone(defaultConfig), ...this._clone(config) };

    ConfigValidator(this._config, true);

    return this;
  }

  /**
   * Sets the authentication credentials for the connection
   *
   * @param userName The user name to use for the connection's authentication
   * @param password The password to use for the connection's authentication
   * @param authSource (Optional) The database to use for authenticating the user, if other than the default options
   */
  public static setCredentials(
    userName: string,
    password: string,
    authSource?: string
  ): typeof UriBuilder {
    this._config.username = userName;
    this._config.password = password;

    if (authSource) {
      this._config.options = { ...this._config.options, authSource };
    }

    return this;
  }

  /**
   * Sets  a host address to the builder's configuration
   *
   * @param host The host address details
   */
  public static setHost(host: string): typeof UriBuilder;
  public static setHost(host: Types.HostAddress): typeof UriBuilder;
  public static setHost(host: string | Types.HostAddress): typeof UriBuilder {
    if (typeof host === "string") {
      if (this._config.host) {
        this._config.host.name = host;
      } else {
        this._config.host = { name: host };
      }
    }
    // It is a full HostAddress
    else {
      this._config.host = host;
    }

    if (this._config.host && !this._config.host.port) {
      this._config.host.port = Types.MONGO_DB_PORT;
    }

    return this;
  }

  /**
   * Sets the URI protocol
   *
   * @param protocol The URI protocol to use (default: 'mongodb')
   */
  public static setProtocol(
    protocol: Types.MongoDbProtocol
  ): typeof UriBuilder {
    this._config.protocol = protocol;

    return this;
  }

  /**
   * Sets the default database to add to the URI
   *
   * @param dbName The database name to set in the URI
   */
  public static setDatabase(dbName: string): typeof UriBuilder {
    this._config.database = dbName;

    return this;
  }

  /**
   *
   * @param replicaSet Sets the array of host addresses for a MongoDB replica set
   *
   * @param replicaSet An array containing the host details for the replica set
   * @param name (Optional) the name of the replica set
   */
  public static setReplicaSet(
    replicaSet: Array<string | Types.HostAddress>,
    name?: string
  ): typeof UriBuilder {
    if (replicaSet) {
      replicaSet.forEach((host) => {
        if (typeof host === "string") {
          this.addHost(host);
        } else {
          this.addHost(host);
        }
      });
    }

    if (name) {
      this._config.options = { ...this._config.options, replicaSet: name };
    }

    return this;
  }

  // Add a replica set host
  private static addHost(host: string): typeof UriBuilder;
  private static addHost(host: Types.HostAddress): typeof UriBuilder;
  private static addHost(
    host: string | Types.HostAddress,
    removeDefaultHost = true
  ): typeof UriBuilder {
    if (removeDefaultHost) {
      this._config.host = undefined;
    }

    if (typeof host === "string") {
      this._config.replicaSet?.push({ name: host, port: Types.MONGO_DB_PORT });
    } else {
      this._config.replicaSet?.push(host);
    }

    return this;
  }

  /**
   * Returns a deep clone of the currently configured connection config object
   */
  public static exportConfig(): Types.UriConfigContract {
    return this._clone(this._config);
  }

  /**
   * Builds the URI from the supplied configuration
   *
   * @returns {string} A MongoDB URI connection string
   */
  public static buildUri(): string {
    // Protocol
    let uriString = `${this._config.protocol}://`;

    // Credentials
    if (Utils.hasUserNameOrPassword(this._config)) {
      uriString += `${encodeURIComponent(
        this._config.username || ""
      )}:${encodeURIComponent(this._config.password || "")}@`;
    }

    // Host
    if (this._config.host && Utils.isNullOrEmpty(this._config.replicaSet)) {
      uriString += this.buildHostUri(
        this._config.host,
        this._options.alwaysShowPort
      );
    }

    // ReplicaSet
    if (!Utils.isNullOrEmpty(this._config.replicaSet)) {
      uriString += this._config.replicaSet
        ?.map((host) => this.buildHostUri(host, this._options.alwaysShowPort))
        .join(";");
    }

    // Database
    if (!Utils.isNullOrEmpty(this._config.database)) {
      uriString += `/${this._config.database}`;
    }

    // Options
    if (this._config.options) {
      const entries = Object.entries(this._config.options);
      if (entries.length > 0) {
        uriString += Utils.isNullOrEmpty(this._config.database) ? "/?" : "?";

        entries.forEach((e) => {
          // If the entry has an object value, we need to dig into that
          const value = e[1];
          if (typeof value === "object") {
            Object.entries(value).forEach((sv) => {
              uriString += `${sv[0]}=${sv[1]}&`;
            });
          } else uriString += `${e[0]}=${value}&`;
        });

        uriString = uriString.slice(0, -1);
      }
    }

    // Reset the config and options for reuse
    this.reset();

    return uriString;
  }

  /**
   * Serializes the URI configuration to JSON
   */
  public static toJSON(): string {
    return JSON.stringify(this._config, (k, v) => {
      if (JSON.stringify(v) === "{}") return undefined;
      else if (Array.isArray(v) && v.every((o) => JSON.stringify(o) === "{}"))
        return undefined;
      else return v;
    });
  }
}

// Statically initialize the builder the first time
UriBuilder.reset();
