const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    parser: './webpack/parser.js',
    root_generator: ['./webpack/root_generator/root_generator.js', './webpack/root_generator/root_generator_carousel.js'],
    dictionary: './webpack/dictionary.js',
  },
  output: {
    library: 'bundle',
    filename: 'wp_[name].js',
    path: path.resolve(__dirname, '../web/res'),
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        options: { asJSON: true },
        type: "json",
        loader: 'yaml-loader'
      }
    ]
  }
};
