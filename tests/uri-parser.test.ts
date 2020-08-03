import { parseUri, errorMessages } from '../src/index'

describe('MongoDB Connection Builder parsing', ()=>{
  const connectionUri = 'mongodb://uid:pwd@127.0.0.1:27017/example?authDb=admin&connectTimeoutMS=300000'

  test('parsing an empty string throws an error', ()=>{
    expect(() => parseUri('')).toThrowError(errorMessages.emptyUriString)
  })

  test('parsing a string which does not start with a protocol throws an error', ()=>{
    expect(()=>parseUri('francis judge')).toThrowError(errorMessages.protocolNotDefined)
  })

  test('parsing a URI with an unrecognized protocol throws an exception', ()=>{
    expect(()=> parseUri('http://www.fjsolutions.co.za')).toThrowError(errorMessages.protocolUnrecognized)
  })

  test('returns a configuration object when a known "mongodb+srv" protocol is passed', ()=>{
    expect(parseUri('mongodb+srv://localhost').protocol).toEqual('mongodb+srv')
  })

  test('returns a configuration object when a known "mongodb" protocol is passed', () => {
    expect(parseUri(connectionUri).protocol).toEqual('mongodb')
  })

  test('returns a configuration object with blank user name and password when no user name and ' +
    'password is supplied', () => {
    const config = parseUri('mongodb://localhost:27017')
    expect(config.username).toBeUndefined()
    expect(config.password).toBeUndefined()
  })

  test('returns a configuration object with user name and password', () => {
    const config = parseUri('mongodb://Francis:Password@localhost:27017')
    expect(config.username).toEqual('Francis')
    expect(config.password).toEqual('Password')
  })

  test('returns a configuration object with decoded user name and password if escaped' +
    ' illegal characters', () => {
    const config = parseUri('mongodb://francis%40fjsolutions.co.za:P%3Ass%25or%2Fd@localhost:27017')
    expect(config.username).toEqual('francis@fjsolutions.co.za')
    expect(config.password).toEqual('P:ss%or/d')
  })

  test('returns a configuration object with a database when one is set', () => {
    const config = parseUri(connectionUri)
    expect(config.database).toEqual('example')
  })

  test('returns a configuration object with an undefined database when one is not set', () => {
    const config = parseUri('mongodb://localhost:27017')
    expect(config.database).toBeUndefined()
  })

  test('returns a configuration object with an array of two options', () => {
    const config = parseUri(connectionUri)
    expect(Object.getOwnPropertyNames(config.options)).toHaveLength(2)
    expect(config.options?.authSource).toEqual('admin')
    expect(config.options?.connections?.connectTimeoutMS).toEqual(300000)
  })

  test('returns a configuration object with an empty array of options', () => {
    const config = parseUri('mongodb://localhost:27017')
    expect(config.options).not.toBeNull()
    expect(config.options).not.toBeUndefined()
    expect(Object.getOwnPropertyNames(config.options)).toHaveLength(0)
  })

  test('returns a configuration object with and array of one option', () => {
    const config = parseUri('mongodb://localhost:27017/?authDb=admin')
    expect(config.options).not.toBeNull()
    expect(Object.getOwnPropertyNames(config.options)).toHaveLength(1)
    expect(config.options?.authSource).toEqual('admin')
  })

  test('returns a configuration object ', () => {
    const config = parseUri('mongodb://localhost:27017')
    expect(config.name).toEqual('Default')
  })

  test('throws an error when no host information is supplied', () => {
    expect(() => parseUri('mongodb://')).toThrowError(errorMessages.hostNotDefined)
  })

  test('returns a configuration object for a single host without an explicit port', () => {
    const config = parseUri('mongodb://localhost/?replicaSet=mySet&authSource=authDB')
    expect(config.replicaSet).toBeUndefined()
    expect(config.host).not.toBeUndefined()
    expect(config.host?.name).toEqual('localhost')
    expect(config.host?.port).toEqual(27017)
  })

  test('returns a configuration object for a single host with an explicit port', () => {
    const config = parseUri('mongodb://localhost:27018/?replicaSet=mySet&authSource=authDB')
    expect(config.replicaSet).toBeUndefined()
    expect(config.host).not.toBeUndefined()
    expect(config.host?.name).toEqual('localhost')
    expect(config.host?.port).toEqual(27018)
  })

  test('returns a configuration object with multiple hosts with mixed explicit ports', () => {
    const config = parseUri('mongodb://mongodb1.example.com:27317,mongodb2.example.com/?replicaSet=mySet&authSource=authDB')
    expect(config.host).toBeUndefined()
    expect(config.replicaSet).not.toBeUndefined()
    expect(config.replicaSet).toHaveLength(2)
    expect(config.replicaSet?.[0].name).toEqual('mongodb1.example.com')
    expect(config.replicaSet?.[0].port).toEqual(27317)
    expect(config.replicaSet?.[1].name).toEqual('mongodb2.example.com')
    expect(config.replicaSet?.[1].port).toEqual(27017)
  })

  test('throws an error when a supplied port cannot be converted to an integer', () => {
    expect(() => (parseUri('mongodb://mongodb2.example.com:abcde')))
      .toThrowError(errorMessages.hostPortNotANumber)
  })

  test('returns a configuration object with multiple options set', () => {
    const config = parseUri('mongodb+srv://francis:abc123ABC@venturechurchcluster1-grcfa.mongodb.net/test?authSource=admin'+
      '&replicaSet=VentureChurchCluster1-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    expect(config.host).not.toBeUndefined()
    expect(config.replicaSet).toBeUndefined()
    expect(config.options).not.toBeUndefined()
    expect(Object.getOwnPropertyNames(config.options)).toHaveLength(5)
    expect(config.options?.authSource).toEqual('admin')
    expect(config.options?.replicaSet).toEqual('VentureChurchCluster1-shard-0')
    expect(config.options?.readConcern?.readPreference).toEqual('primary')
    expect(config.options?.appName).toEqual('MongoDB Compass')
    expect(config.options?.security?.tls).toEqual(true)
  })
})
