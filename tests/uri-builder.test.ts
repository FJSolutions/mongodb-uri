import { UriBuilder as MongoDbUriBuilder, UriConfigContract, DbOptions } from '../src/index'

describe('Test building MongoDB connection URIs', () => {
  test('the default config object builds a valid connection URI', () => {
    const connectionUri = MongoDbUriBuilder.buildUri()
    expect(connectionUri).toEqual('mongodb://localhost')
  })
  
  test('setting the host on the builder updates the main host', () => {
    const connectionUri = MongoDbUriBuilder.setHost('example.com').buildUri()
    expect(connectionUri).toEqual('mongodb://example.com')
  })
  
  test('setting the host with a host address updates the main host', () => {
    const connectionUri = MongoDbUriBuilder.setHost({ name: 'example.com', port: 27018 }).buildUri()
    expect(connectionUri).toEqual('mongodb://example.com:27018')
  })
  
  test('setting the user name and password on the builds generates valid connection URI', () => {
    const connectionUri = MongoDbUriBuilder.setCredentials('test-user','passworD').buildUri()
    expect(connectionUri).toEqual('mongodb://test-user:passworD@localhost')
  })

  test('the default config object serializes to a JSON string', () => {
    const json = MongoDbUriBuilder.toJSON()
    expect(json).toEqual('{"name":"Default","host":{"name":"localhost","port":27017},"protocol":"mongodb"}')
  })

  test('the default config object with options builds a valid connection URI', () => {
    const connectionUri = MongoDbUriBuilder.setBuilderOptions({ alwaysShowPort: true }).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost:27017')
  })

  test('the default config object with a configuration override builds a valid connection URI', () => {
    const config: UriConfigContract = {
      host: { name: '127.0.0.1', port: 27018 },
    }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://127.0.0.1:27018')
  })

  test('an overridden config object with database creates a valid URI', () => {
    const config: UriConfigContract = { database: 'example' }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost/example')
  })

  test('an overridden config object with escaped username and password creates a valid URI', () => {
    const config: UriConfigContract = { username: 'francis@fjsolutions.co.za', password: 'P@ssw/0r%d@' }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://francis%40fjsolutions.co.za:P%40ssw%2F0r%25d%40@localhost')
  })

  test('an overridden config object with a single option creates a valid URI', () => {
    const config: UriConfigContract = { options: [{ key: 'ssl', value: true }] }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost/?ssl=true')
  })

  test('an overridden config object with a database name and single option creates a valid URI', () => {
    const config: UriConfigContract = { database: 'example', options: [{ key: 'ssl', value: true }] }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost/example?ssl=true')
  })

  test('an overridden config object with two options creates a valid URI', () => {
    const config: UriConfigContract = {
      options: [
        { key: 'ssl', value: true },
        { key: 'authSource', value: 'admin' },
      ],
    }
    const connectionUri = MongoDbUriBuilder.setConfig(config).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost/?ssl=true&authSource=admin')
  })

  test('adding a replica set populates the config and outputs the correct URI', () => {
    const connectionUri = MongoDbUriBuilder.setReplicaSet([
      'example1.com',
      { name: 'example2.com', port: 27018 },
      { name: 'example3.com', port: 27019 },
    ]).buildUri()
    expect(connectionUri).toEqual('mongodb://example1.com;example2.com:27018;example3.com:27019')
  })

  test('adding a replica set with an optional name populates the config', () => {
    const connectionUri = MongoDbUriBuilder.setReplicaSet([
      'example1.com',
      { name: 'example2.com', port: 27018 },
      { name: 'example3.com', port: 27019 },
    ], '').buildUri()
    expect(connectionUri).toEqual('mongodb://example1.com;example2.com:27018;example3.com:27019')
  })

  test('set the auth source option on credentials', () => {
    const connectionUri = MongoDbUriBuilder.setCredentials('Francis', 'Password', 'auth-db').buildUri()
    expect(connectionUri).toEqual('mongodb://Francis:Password@localhost/?authSource=auth-db')
  })

  test('add an option to the connection URI', () => {
    const connectionUri = MongoDbUriBuilder.setOption(DbOptions.MAX_POOL_SIZE, 5).buildUri()
    expect(connectionUri).toEqual('mongodb://localhost/?maxPoolSize=5')
  })
})
