import test from 'japa'
import { UriBuilder } from '../src/index'

test.group('Testing URI Builder in stand-alone mode', () => {
  test('Supplying no parameters still produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://localhost')
    // console.log(connectionUri);
  })

  test('Supplying host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setHost('mongodb.fjsolutions.co.za').buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://mongodb.fjsolutions.co.za')
    // console.log(connectionUri);
  })

  test('Supplying setting protocol and host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setHost('mongodb.fjsolutions.co.za').setProtocol('mongodb+srv').buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb+srv://mongodb.fjsolutions.co.za')
    // console.log(connectionUri);
  })

  test('Supplying setting credentials and host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setHost('mongodb.fjsolutions.co.za').setCredentials('user-name', 'password').buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://user-name:password@mongodb.fjsolutions.co.za')
    // console.log(connectionUri);
  })

  test('Supplying setting auth-db and host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setConfig({ database: 'auth-db' }).setHost('mongodb.fjsolutions.co.za').buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://mongodb.fjsolutions.co.za/auth-db')
    // console.log(connectionUri);
  })

  test('Supplying setting database and host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setDatabase('auth-db').setHost('mongodb.fjsolutions.co.za').buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://mongodb.fjsolutions.co.za/auth-db')
    // console.log(connectionUri);
  })

  test('Supplying setting database, auth-db, and host produces a valid URI', (assert) => {
    const connectionUri = UriBuilder.setDatabase('products')
      .setHost('mongodb.fjsolutions.co.za')
      .setOptions({ authSource: 'auth-db' })
      .buildUri()

    assert.isNotEmpty(connectionUri)
    assert.equal(connectionUri, 'mongodb://mongodb.fjsolutions.co.za/products?authSource=auth-db')
    // console.log(connectionUri);
  })

  test('Build from an existing URI', (assert) => {
    const uriString = 'mongodb+srv://test-cluster.h6qod.mongodb.net'
    const connectionUri = UriBuilder.fromUri(uriString).buildUri()

    assert.isDefined(connectionUri)
    assert.isNotNull(connectionUri)
    assert.isTrue(connectionUri.length > 7)
    assert.equal(connectionUri, uriString)
    // console.log(connectionUri)
  })

  test('Build from an existing URI and add a database', (assert) => {
    const connectionUri = UriBuilder.fromUri('mongodb+srv://test-cluster.h6qod.mongodb.net').setDatabase('test').buildUri()

    assert.isDefined(connectionUri)
    assert.isNotNull(connectionUri)
    assert.isTrue(connectionUri.length > 7)
    assert.equal(connectionUri, 'mongodb+srv://test-cluster.h6qod.mongodb.net/test')
    // console.log(connectionUri)
  })

  test('Build from an existing URI and add a database and credentials', (assert) => {
    const connectionUri = UriBuilder.fromUri('mongodb+srv://test-cluster.h6qod.mongodb.net')
      .setDatabase('test')
      .setCredentials('user-name', 'secret-password')
      .buildUri()

    assert.isDefined(connectionUri)
    assert.isNotNull(connectionUri)
    assert.isTrue(connectionUri.length > 7)
    assert.equal(connectionUri, 'mongodb+srv://user-name:secret-password@test-cluster.h6qod.mongodb.net/test')
    // console.log(connectionUri)
  })
})
