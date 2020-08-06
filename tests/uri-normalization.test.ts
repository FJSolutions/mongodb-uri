import { normalizeUri, errorMessages } from '../src/index'

const connection = {
  protocol: 'mongodb',
  host: 'localhost',
  port: '27017',
  // username: 'admin',
  user: 'admin',
  // uid: 'admin',
  password: 'Password',
  database: 'adonis',
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
    // replicaSet: ('DB_REPLICA_SET_NAME', '')
    ssl: true,
    // connectTimeoutMS: ('DB_CONNECT_TIMEOUT_MS', 15000),
    // socketTimeoutMS: ('DB_SOCKET_TIMEOUT_MS', 180000),
    // w: ('DB_W, 0),
    // wtimeoutMS: ('DB_W_TIMEOUT_MS, 0),
    // journal: ('DB_JOURNAL, 0),
    // readPreference: ('DB_READ_PREFERENCE', 'secondary'),
    authSource: 'admin',
    // authMechanism: ('DB_AUTH_MECHANISM', ''),
    // maxPoolSize: ('POOL_MAX_SIZE', ''),
    // minPoolSize: ('POOL_MIN_SIZE', ''),
    // maxIdleTimeMS: ('POOL_MAX_IDLE_TIME_MS', ''),
    // other options
    // tlsCertificateKeyFile: '',
    // tlsCertificateKeyFilePassword: '',
    // tlsCAFile: '',
    // tlsAllowInvalidCertificates: '',
    // tlsAllowInvalidHostnames: '',
    tlsInsecure: true,
    // connectTimeoutMS: '',
    // socketTimeoutMS: '',
    // compressors: '',
    // zlibCompressionLevel: '',
    // maxPoolSize: '',
    // minPoolSize: '',
    // maxIdleTimeMS: '',
    // waitQueueMultiple: '',
    // waitQueueTimeoutMS: '',
    // w: '',
    // wtimeoutMS: '',
    // journal: '',
    // readConcernLevel: '',
    // readPreference: '',
    // retryReads: '',
    // retryWrites: '',
  }
}

describe('normalize an object into a connection configuration contract', ()=>{
  test('that it throws when no config option has been passed',() => {
    expect(() => normalizeUri(undefined)).toThrowError(errorMessages.configObjNotDefined)
  })

  test('that it normalizes an object with basic user, password, and database to normalize to a valid connection URI',
    () => {
      const config = normalizeUri(connection)
      expect(config).not.toBeNull()
      expect(config.username).toEqual('admin')
      expect(config.password).toEqual('Password')
      expect(config.database).toEqual('adonis')
      expect(config.protocol).toEqual('mongodb')
      expect(config.name).toEqual('Default')
      expect(config.host).not.toBeNull()
      expect(config.host?.name).toEqual('localhost')
      expect(config.host?.port).toEqual(27017)
    }
  )

  test('that it normalizes an object with options to a valid connection URI',() => {
    const config = normalizeUri(connection)
    expect(config).not.toBeNull()
    expect(config.options).not.toBeUndefined()
    expect(config.options).not.toBeNull()
    expect(config.options?.security?.tls).toEqual(true)
    expect(config.options?.security?.tlsInsecure).toEqual(true)
    expect(config.options?.authSource).toEqual('admin')
  })

  test('that it normalizes an object with a replica set to a valid connection URI',() => {
    const config = normalizeUri(connection)
    expect(config).not.toBeNull()
    expect(config.replicaSet).not.toBeUndefined()
    expect(config.replicaSet).toHaveLength(4)
    expect(config.replicaSet?.[0]).not.toBeNull()
    expect(config.replicaSet?.[0].name).toEqual('db0.example.com')
    expect(config.replicaSet?.[0].port).toEqual(27017)
    expect(config.replicaSet?.[1]).not.toBeNull()
    expect(config.replicaSet?.[1].name).toEqual('db1.example.com')
    expect(config.replicaSet?.[1].port).toEqual(27018)
    expect(config.replicaSet?.[2]).not.toBeNull()
    expect(config.replicaSet?.[2].name).toEqual('db2.example.com')
    expect(config.replicaSet?.[2].port).toEqual(27019)
    expect(config.replicaSet?.[3]).not.toBeNull()
    expect(config.replicaSet?.[3].name).toEqual('db3.example.com')
    expect(config.replicaSet?.[3].port).toEqual(27020)
  })
})
