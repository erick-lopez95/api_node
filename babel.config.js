export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: 'commonjs'
      }
    ]
  ],
  ignore: [
    'node_modules/(?!(amqplib|node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill)/)'
  ]
}