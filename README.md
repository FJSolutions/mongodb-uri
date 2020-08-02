# mongodb-uri

A library for configuring, parsing, and building MongoDB connection URIs. 


creating, loading, normalizing, and validating configuration information 

parse and generate MongoDB URI connection strings.

## Installation

```sh
npm install @fjsolutions/mongodb-uri
```

## Build URI

For the most basic scenario (localhost, without authentication) the default configuration will create a usable connection URI

```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder.buildUri()   // 'mongodb://localhost'
```

If you want the default port to always be specified then you can set the builder option `alwaysShowPort` to `true`. By default the default port is hidden in the URI string.

```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder
    .setBuilderOptions({ alwaysShowPort: true })
    .buildUri()   // 'mongodb://localhost:27017'
```

## Parse URI

A function that parses a URI connection string and returns a `UriConfigContract`

## URI Configuration

This is the interface for the connection URI configuration 

## Normalize Configuration

It is possible to take an object that has a similar shape to `UriConfigContract` and 'normalize' it. 
This us useful for flatter configurations and config objects that have an object of options.
