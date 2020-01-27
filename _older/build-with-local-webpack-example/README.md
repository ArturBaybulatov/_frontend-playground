# Make Node.js libraries available in a browser, with Webpack

Setup:

1. Import desired libraries to a global scope, within an `src/index.js` file
2. Bundle the file with dependencies with Webpack to `dist/index.js`
3. Include the resulting file into a web page

Install Webpack and bundle:

```
npm install
npm run build
```

For automatic rebundling on code changes use:

```
npm run build-watch
```
