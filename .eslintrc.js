module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "@vue/airbnb"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "max-len": ["warn", { code: 140 }],
    "linebreak-style": 0,
    "space-before-blocks": "off",
    quotes: "off",
    "no-extra-semi": "off",
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};

// 'vue/max-len': ['warn', {
//   code: 140,
//   template: 140,
//   tabWidth: 2,
//   comments: 120,
//   ignorePattern: '',
//   ignoreComments: false,
//   ignoreTrailingComments: false,
//   ignoreUrls: false,
//   ignoreStrings: false,
//   ignoreTemplateLiterals: false,
//   ignoreRegExpLiterals: false,
//   ignoreHTMLAttributeValues: false,
//   ignoreHTMLTextContents: false,
// }],
