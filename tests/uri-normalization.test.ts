import test from 'japa'
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

test.group('Normalizes an object into a connection configuration contract', () => {

  test('that it throws when no config option has been passed', assert => {
    assert.throw(() => normalizeUri(undefined), errorMessages.configObjNotDefined)
  })

  test('that it normalizes an object with basic user, password, and database to normalize to a valid connection URI',
    assert => {
      assert.plan(9)
      const config = normalizeUri(connection)
      assert.isNotNull(config)
      assert.equal(config.username,'admin')
      assert.equal(config.password, 'Password')
      assert.equal(config.database,'adonis')
      assert.equal(config.protocol,'mongodb')
      assert.equal(config.name,'Default')
      assert.isNotNull(config.host)
      assert.equal(config.host?.name,'localhost')
      assert.equal(config.host?.port,27017)
    }
  )

  test('that it normalizes an object with options to a valid connection URI', assert => {
    const config = normalizeUri(connection)
    assert.plan(6)
    assert.isNotNull(config)
    assert.isOk(config.options)
    assert.isNotNull(config.options)
    assert.equal(config.options?.encryption?.tls, true)
    assert.equal(config.options?.encryption?.tlsInsecure, true)
    assert.equal(config.options?.authSource, 'admin')
  })

  test('that it normalizes an object with a replica set to a valid connection URI',assert => {
    const config = normalizeUri(connection)
    assert.plan(15)
    assert.isNotNull(config)
    assert.isOk(config.replicaSet)
    assert.equal(config.replicaSet?.length, 4)
    assert.isOk(config.replicaSet?.[0])
    assert.equal(config.replicaSet?.[0].name, 'db0.example.com')
    assert.equal(config.replicaSet?.[0].port, 27017)
    assert.isOk(config.replicaSet?.[1])
    assert.equal(config.replicaSet?.[1].name, 'db1.example.com')
    assert.equal(config.replicaSet?.[1].port, 27018)
    assert.isOk(config.replicaSet?.[2])
    assert.equal(config.replicaSet?.[2].name, 'db2.example.com')
    assert.equal(config.replicaSet?.[2].port, 27019)
    assert.isOk(config.replicaSet?.[3])
    assert.equal(config.replicaSet?.[3].name, 'db3.example.com')
    assert.equal(config.replicaSet?.[3].port, 27020)
  })
})
