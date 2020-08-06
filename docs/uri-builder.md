# UriBuilder

The `UriBuilder` class is a static builder class that works with an internal `ConnectionConfigContract` instance for managing URI parameters.


## Basic usage

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

You can also serialize the `UriBuilder` configuration to JSON

```js
import { UriBuilder } from 'mongodb-uri'

var json = UriBuilder.toJSON()   
// {
//     "name":"Default",
//     "protocol":"mongodb"
//     "host": {
//          "name":"localhost",
//          "port":27017
//      }
// }
```

Every configuration object has a name, which is set to `Default` by default. 

To set the host and port explicitly on the `UriBuilder` call the `addHost()` method passing in either the host name or an object with the host name and port number.

```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder
    .setHost({name: 'example.com', port: 27018})
    .buildUri()   // 'mongodb://example.com:27018'
```

Similarly the user name and password can be set with the `setCredentials()` method.

```js
import { UriBuilder } from 'mongodb-uri'

var connectionUri = UriBuilder
    .setCredentials('test-user','passw0rd')
    .buildUri()   // 'mongodb://test-user:passw0rd@localhost:27018'
```

### Setting values

*N.B.* All of the `set` methods on the `UriBuilder` return the builder and so provide a fluid API for chaining method calls before outputting a result.

Settings for outputting configuration details can be set by passing a `BuilderOptionsContract` object

```js
const connectionUri = UriBuilder
    .setBuilderOptions({ alwaysShowPort: true })
    .buildUri()     // 'mongodb://localhost:27017')
```

Currently the only option on this object is whether to always show the default port of 27017 in the URI connection string (the default is false)

* `setOptions(options: Types.UriOptionsContract)`
* `setCredentials(userName: string, password: string, authSource?: string)`
* `setHost(host: string | Types.HostAddress)`
* `setReplicaSet(replicaSet: Array<string | Types.HostAddress>, name?: string)`
* `setOptions(options: Types.UriOptionsContract)`

TODO: Complete documentation

## Output

* `buildUri()`
* `toJSON()`
* `exportConfig()`

*N.B.* It is important to realize that after calling `buildUri()` the config of the builder is reset to it's default values.

TODO: Complete documentation

## Initializing from a URI Configuration object

TODO: Complete documentation

## Initializing by normalizing from a plain object

TODO: Complete documentation
