module.exports = {
  extends: [
    "eslint:recommended",
  ],
  extends: "airbnb-base/legacy",
  settings: {
    react: {
      version: "detect"
    }
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    }
  },
  env: {
    browser: true,
    mocha: true,
    node: true,
    es6: true
  },
  plugins: [
    "import",
    "react"
  ]
}
