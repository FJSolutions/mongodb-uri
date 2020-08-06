# mongodb-uri

A library for configuring, parsing, and building MongoDB connection URIs. 


creating, loading, normalizing, and validating configuration information 

parse and generate MongoDB URI connection strings.

## Installation

```sh
npm install @fjsolutions/mongodb-uri --save
```

The URI parser/builder will be a runtime dependency, so the `--save` flag is used so that it is available at runtime.

## Build URI

For a simple usage scenario (localhost, without authentication) the default configuration will create a usable connection URI:

```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder.buildUri()   // 'mongodb://localhost'
```

If you want the default port to always be specified then you can set the builder option `alwaysShowPort` to `true`. By default the default port is hidden in the URI string.

There are various `set` methods on the `UriBuilder` that can be chained in a fluent API. With them all the configuration settings for a connection URI can be set before outputting the connection string. 

```js
const connectionUri = UriBuilder
    .setCredentials('test-user','passworD')
    .buildUri()     // 'mongodb://test-user:passworD@localhost'
```

There are three output methods:

* `buildUri()` - Builds a URI connection string for use with a MongoDB driver.
* `toJSON()` - Serializes the connection configuration details to a JSON string.
* `exportConfig()` - Exports the connection configuration object.


```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder
    .setBuilderOptions({ alwaysShowPort: true })
    .buildUri()   // 'mongodb://localhost:27017'
```

## URI Configuration

A Typescript interface that defines the connection URI configuration object. It defines the properties and the shape of URI configuration objects. Properties set on this object will be merged with those already set in the `UriBuilder`.

```js
const config: UriConfigContract = { 
  username: 'test-user',
  password: 'secret',
  host: {
    name: 'example.com', 
    port: 27018 
  }
}
```

Creates a URI configuration object with authorization credentials and host details set.

TODO: Complete documentation

## Normalize Configuration

It is possible to take an object that has a similar shape to `UriConfigContract` and 'normalize' it to the shape of a `UriConfigurationContract`.
This us useful for flatter configurations and config objects that have an object of options.

```js
const connection = {
  protocol: 'mongodb+srv',
//   host: 'localhost',
//   port: '27017',
  // username: 'admin',
  user: 'admin',
  // uid: 'admin',
  password: 'Secret',
  database: 'test-db',
  replicaSet: [
    {
      host: 'db0.example.com',
      port: '27017',
    },
    {
      name: 'db1.example.com',
      port: '27018',
    },
    'db2.example.com:27019',
    {
      address: 'db3.example.com',
      port: '27020',
    },
  ],
  options: {
    ssl: true,
  }
}
const config = normalizeUri(connection)
const connectionUri = UriBuilder
    .setConfig(config)
    .buildUri()     // 'mongodb+srv://admin:Secret@db0.example.com;db1.example.com:27018;db2.example.com:27019;db3.example.com:27020/test-db?tls=true'
```

## URI Parser

There is a utility function called `parseUri()` that takes a valid URI connection string and parses it onto a `UriConfigContract`.

*N.B.* All the functions that take input and convert them to `UriConfigContract` instances validate their input and will throw errors if the state of the config object is invalid.
