const { NODE_ENV, BABEL_ENV } = process.env;
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs';
const setModules = cjs ? 'commonjs' : false;
const loose = true;

module.exports = {
  presets: [['@babel/env', { loose, modules: setModules }], 'minify'],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
    cjs && ['@babel/transform-modules-commonjs', { loose }],
    ['@babel/transform-runtime', { useESModules: !cjs }],
  ].filter(Boolean),
};
