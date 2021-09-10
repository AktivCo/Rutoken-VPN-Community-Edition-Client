module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "curly": "error",
        "quotes": ["error", "single"]
    },
    "parser": "babel-eslint"
};
