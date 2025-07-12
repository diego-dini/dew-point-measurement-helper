module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          types: './src/types',
          utils: './src/utils',
          elements: './src/elements',
          screens: './src/screens',
        },
      }],
    ],
  };
};