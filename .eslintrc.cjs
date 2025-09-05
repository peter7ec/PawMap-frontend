module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "plugin:react/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.app.json", "./tsconfig.node.json"],
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/jsx-props-no-spreading": "off",
    "no-underscore-dangle": [
      "error",
      { allow: ["_count", "_avg", "_sum", "_min", "_max", "_all"] },
    ],
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react/require-default-props": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.js", "vite.config.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "prefer-destructuring": "off",
        "@typescript-eslint/prefer-destructuring": "off",
      },
    },
  ],
  ignorePatterns: ["src/components/ui/", "src/lib"],
};
