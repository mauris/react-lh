const { NODE_ENV, BABEL_ENV } = process.env;
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs';
const loose = true;

module.exports = {
  presets: ["@babel/react", ['@babel/env', { loose }]],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
    cjs && ['@babel/transform-modules-commonjs', { loose }],
    ['@babel/transform-runtime', { useESModules: !cjs }],
    ['@babel/proposal-export-default-from'],
  ].filter(Boolean),
};
