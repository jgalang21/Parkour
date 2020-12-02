// module.exports = {
//   presets: [
//     ['@babel/preset-env', { targets: { node: 'current' } }],
//     ['@babel/preset-react'],
//     ['@babel/preset-typescript']

//   ],
//   plugins: [['@babel/plugin-proposal-class-properties']]
// };
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        safe: true,
        allowUndefined: false,
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null
      }
    ]
  ]
};
