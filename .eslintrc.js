module.exports = {
  extends: [
    "eslint:recommended",
    "airbnb-base/legacy",
    "plugin:react/recommended"
  ],
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
    jest: true,
    node: true,
    es6: true
  },
  plugins: [
    "import",
    "react"
  ]
}
