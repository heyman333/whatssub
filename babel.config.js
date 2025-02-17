module.exports = {
  'presets': ['module:metro-react-native-babel-preset', '@babel/preset-typescript'],
  'sourceMaps': 'inline',
  'plugins': [
    [
      '@babel/plugin-transform-runtime',
      {
        'helpers': true,
        'regenerator': false,
      },
    ],
    '@babel/proposal-object-rest-spread',
    ['babel-plugin-styled-components'],
  ],
};
