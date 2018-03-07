Forever
====
A distributed file shareing and hosting app which built on IPFS.

![Forever](./screenshots/Forever.jpg)

# Get Started

The easiest way to use Forever is clicking [here](https://ipfs-forever.github.io).

# Host a local website

You can also build the project to host local website.

### 1. Installing Node.js

Install the latest Node.js from [https://nodejs.org](https://nodejs.org).

### 2. Building the project

```
git clone https://github.com/UnsignedInt8/Forever.git
cd Forever
npm install
```

After all dependences having been installed, type this command.

```
npm run eject
```

Then, open `config/webpack.config.prod.js`, and remove these code as below shown.

```
// Minify the code.
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    // Disabled because of an issue with Uglify breaking seemingly valid code:
    // https://github.com/facebookincubator/create-react-app/issues/2376
    // Pending further investigation:
    // https://github.com/mishoo/UglifyJS2/issues/2011
    comparisons: false,
  },
  mangle: {
    safari10: true,
  },
  output: {
    comments: false,
    // Turned on because emoji and regex is not minified properly using default
    // https://github.com/facebookincubator/create-react-app/issues/2488
    ascii_only: true,
  },
  sourceMap: shouldUseSourceMap,
}),
```

Almostly done, the last step is building this project.

```
npm run build
```

Done! The website files are located in the `build` folder. 

### 3. Launch a HTTP server

You also need to launch a http-server on your machine to host the website.

```
npm i -g http-server
cd build 
http-server ./
```

# License

GPL-3.0
