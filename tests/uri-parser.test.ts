import test from 'japa'
import { parseUri, errorMessages } from '../src/index'

test.group('MongoDB Connection Builder parsing', () => {
  const connectionUri = 'mongodb://uid:pwd@127.0.0.1:27017/example?authDb=admin&connectTimeoutMS=300000'

  test('parsing an empty string throws an error', assert => {
    assert.throws(() => parseUri(''), errorMessages.emptyUriString)
  })

  test('parsing a string which does not start with a protocol throws an error', assert => {
    assert.throws(()=>parseUri('francis judge'), errorMessages.protocolNotDefined)
  })

  test('parsing a URI with an unrecognized protocol throws an exception', assert => {
    assert.throws(()=> parseUri('http://www.fjsolutions.co.za'), errorMessages.protocolUnrecognized)
  })

  test('returns a configuration object when a known "mongodb+srv" protocol is passed', assert => {
    assert.equal(parseUri('mongodb+srv://localhost').protocol, 'mongodb+srv')
  })

  test('returns a configuration object when a known "mongodb" protocol is passed', assert => {
    assert.equal(parseUri(connectionUri).protocol, 'mongodb')
  })

  test('returns a configuration object with blank user name and password when no user name and ' +
    'password is supplied', assert => {
    const config = parseUri('mongodb://localhost:27017')
    assert.isNotOk(config.username)
    assert.isNotOk(config.password)
  })

  test('returns a configuration object with user name and password', assert => {
    const config = parseUri('mongodb://Francis:Password@localhost:27017')
    assert.equal(config.username, 'Francis')
    assert.equal(config.password, 'Password')
  })

  test('returns a configuration object with decoded user name and password if escaped illegal characters', assert => {
    const config = parseUri('mongodb://francis%40fjsolutions.co.za:P%3Ass%25or%2Fd@localhost:27017')
    assert.equal(config.username, 'francis@fjsolutions.co.za')
    assert.equal(config.password, 'P:ss%or/d')
  })

  test('returns a configuration object with a database when one is set', assert => {
    const config = parseUri(connectionUri)
    assert.equal(config.database, 'example')
  })

  test('returns a configuration object with an undefined database when one is not set', assert => {
    const config = parseUri('mongodb://localhost:27017')
    assert.isNotOk(config.database)
  })

  test('returns a configuration object with an array of two options', assert => {
    const config = parseUri(connectionUri)
    assert.lengthOf(Object.getOwnPropertyNames(config.options), 2)
    assert.equal(config.options?.authSource, 'admin')
    assert.equal(config.options?.connections?.connectTimeoutMS, 300000)
  })

  test('returns a configuration object with an empty array of options', assert => {
    const config = parseUri('mongodb://localhost:27017')
    assert.isOk(config.options)
    assert.lengthOf(Object.getOwnPropertyNames(config.options), 0)
  })

  test('returns a configuration object with and array of one option', assert => {
    const config = parseUri('mongodb://localhost:27017/?authDb=admin')
    assert.isOk(config.options)
    assert.lengthOf(Object.getOwnPropertyNames(config.options), 1)
    assert.equal(config.options?.authSource, 'admin')
  })

  test("returns a 'Default' configuration object", assert => {
    const config = parseUri('mongodb://localhost:27017')
    assert.equal(config.name, 'Default')
  })

  test('throws an error when no host information is supplied', assert => {
    assert.throws(() => parseUri('mongodb://'), errorMessages.hostNotDefined)
  })

  test('returns a configuration object for a single host without an explicit port', assert => {
    const config = parseUri('mongodb://localhost/?replicaSet=mySet&authSource=authDB')
    assert.isNotOk(config.replicaSet)
    assert.isOk(config.host)
    assert.equal(config.host?.name, 'localhost')
    assert.equal(config.host?.port, 27017)
  })

  test('returns a configuration object for a single host with an explicit port', assert => {
    const config = parseUri('mongodb://localhost:27018/?replicaSet=mySet&authSource=authDB')
    assert.isNotOk(config.replicaSet)
    assert.isOk(config.host)
    assert.equal(config.host?.name, 'localhost')
    assert.equal(config.host?.port, 27018)
  })

  test('returns a configuration object with multiple hosts with mixed explicit ports', assert => {
    const config = parseUri('mongodb://mongodb1.example.com:27317,mongodb2.example.com/?replicaSet=mySet&authSource=authDB')
    assert.isNotOk(config.host)
    assert.isOk(config.replicaSet)
    assert.equal(config.replicaSet?.length, 2)
    assert.equal(config.replicaSet?.[0].name, 'mongodb1.example.com')
    assert.equal(config.replicaSet?.[0].port, 27317)
    assert.equal(config.replicaSet?.[1].name, 'mongodb2.example.com')
    assert.equal(config.replicaSet?.[1].port, 27017)
  })

  test('throws an error when a supplied port cannot be converted to an integer', assert => {
    assert.throws(() => parseUri('mongodb://mongodb2.example.com:abcde'), errorMessages.hostPortNotANumber)
  })

  test('returns a configuration object with multiple options set', assert => {
    const config = parseUri('mongodb+srv://francis:abc123ABC@venturechurchcluster1-grcfa.mongodb.net/test?authSource=admin'+
      '&replicaSet=VentureChurchCluster1-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    assert.isOk(config.host)
    assert.isNotOk(config.replicaSet)
    assert.isOk(config.options)
    assert.lengthOf(Object.getOwnPropertyNames(config.options), 5)
    assert.equal(config.options?.authSource, 'admin')
    assert.equal(config.options?.replicaSet, 'VentureChurchCluster1-shard-0')
    assert.equal(config.options?.readConcern?.readPreference, 'primary')
    assert.equal(config.options?.appName, 'MongoDB Compass')
    assert.equal(config.options?.encryption?.tls, true)
  })
})
