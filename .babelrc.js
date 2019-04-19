
module.exports = {
  presets: ["@babel/react", "@babel/env"],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread'],
    ['@babel/proposal-export-default-from']
  ],
};
