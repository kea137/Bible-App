module.exports = function (api) {
  api.cache(true);

  const plugins = [
    // 'react-native-worklets/plugin', // Temporarily disabled to test boolean error
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@showcase': './',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
