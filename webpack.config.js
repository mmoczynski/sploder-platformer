const path = require("path")

module.exports = {
  entry: './html5/src/index.js',
  output: {
    path: path.resolve(__dirname, './html5/dist'),
    filename: 'bundle.js',
  },
  mode: "development",
  devtool: false,

  /** 

  module: {
    rules: [
        {
            test: /.xml$/,
            use: "webpack-definition-xml-loader"
        }
      ]
  },

  resolveLoader: {
    alias: {
        "webpack-definition-xml-loader": "./webpack-xml-loader/index.js"
    }
  }

  **/

};