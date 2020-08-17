import test from 'japa'
import { UriBuilder, UriConfigContract } from '../src/index'

test.group('Test building MongoDB connection URIs', () => {

  test('the default config object builds a valid connection URI', assert => {
    const connectionUri = UriBuilder.buildUri()
    assert.equal(connectionUri, 'mongodb://localhost')
  })
  
  test('setting the host on the builder updates the main host', assert => {
    const connectionUri = UriBuilder.setHost('example.com').buildUri()
    assert.equal(connectionUri, 'mongodb://example.com')
  })
  
  test('setting the host with a host address updates the main host', assert => {
    const connectionUri = UriBuilder.setHost({ name: 'example.com', port: 27018 }).buildUri()
    assert.equal(connectionUri, 'mongodb://example.com:27018')
  })
  
  test('setting the user name and password on the builds generates valid connection URI', assert => {
    const connectionUri = UriBuilder.setCredentials('test-user','passworD').buildUri()
    assert.equal(connectionUri, 'mongodb://test-user:passworD@localhost')
  })

  test('the default config object serializes to a JSON string', assert => {
    const json = UriBuilder.toJSON()
    assert.equal(json, '{"name":"Default","host":{"name":"localhost","port":27017},"protocol":"mongodb"}')
  })

  test('the default config object with options builds a valid connection URI', assert => {
    const connectionUri = UriBuilder.setBuilderOptions({ alwaysShowPort: true }).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost:27017')
  })

  test('the default config object with a configuration override builds a valid connection URI', assert => {
    const config: UriConfigContract = {
      host: { name: '127.0.0.1', port: 27018 },
    }
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://127.0.0.1:27018')
  })

  test('an overridden config object with database creates a valid URI', assert => {
    const config: UriConfigContract = { database: 'example' }
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost/example')
  })

  test('an overridden config object with escaped username and password creates a valid URI', assert => {
    const config: UriConfigContract = { username: 'fjudge7@gmail.com', password: 'P@ssw/0r%d@' }
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://fjudge7%40gmail.com:P%40ssw%2F0r%25d%40@localhost')
  })

  test('an overridden config object with a single option creates a valid URI', assert => {
    const config: UriConfigContract = { options: { encryption: { tls: true } } } 
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost/?tls=true')
  })

  test('an overridden config object with a database name and single option creates a valid URI', assert => {
    const config: UriConfigContract = { database: 'example', options: { appName:'mongodb-uri', encryption: { tls: true } } }
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost/example?appName=mongodb-uri&tls=true')
  })

  test('an overridden config object with two options creates a valid URI', assert => {
    const config: UriConfigContract = { options: { authSource: 'admin', encryption: { tls: true } } }
    const connectionUri = UriBuilder.setConfig(config).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost/?authSource=admin&tls=true')
  })

  test('adding a replica set populates the config and outputs the correct URI', assert => {
    const connectionUri = UriBuilder.setReplicaSet([
      'example1.com',
      { name: 'example2.com', port: 27018 },
      { name: 'example3.com', port: 27019 },
    ]).buildUri()
    assert.equal(connectionUri, 'mongodb://example1.com;example2.com:27018;example3.com:27019')
  })

  test('adding a replica set with an optional name populates the config', assert => {
    const connectionUri = UriBuilder.setReplicaSet([
      'example1.com',
      { name: 'example2.com', port: 27018 },
      { name: 'example3.com', port: 27019 },
    ], 'myReplicaSet').buildUri()
    assert.equal(connectionUri, 'mongodb://example1.com;example2.com:27018;example3.com:27019/?replicaSet=myReplicaSet')
  })

  test('set the auth source option on credentials', assert => {
    const connectionUri = UriBuilder.setCredentials('Francis', 'Password', 'auth-db').buildUri()
    assert.equal(connectionUri, 'mongodb://Francis:Password@localhost/?authSource=auth-db')
  })

  test('add an option to the connection URI', assert => {
    const connectionUri = UriBuilder.setOptions({ connections: { maxPoolSize: 5 } }).buildUri()
    assert.equal(connectionUri, 'mongodb://localhost/?maxPoolSize=5')
  })
})
