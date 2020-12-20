require('ts-node').register()
const { configure } = require('japa')

configure({
  files: [
      'tests/uri-normalization.test.ts',
      'tests/uri-parser.test.ts',
      'tests/uri-builder.test.ts',
      'tests/uri-builder-standalone.test.ts',
    ]
})