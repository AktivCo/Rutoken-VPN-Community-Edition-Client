var path = require('path'); 
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');

module.exports = (env) => {

    const entryResources = [];

    entryResources.push( 
        './app/front/css/main.css', 
        './app/front/utils/string-util.js',
        './app/front/main.js', 
    ); 
    return {
        entry: entryResources,

        output: {
            path: path.resolve(__dirname, './app'),
            filename: 'app.bundle.js'
        },

        module: {
            rules: [
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 250000
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            [
                                'es2015', {
                                    "loose": true,
                                },
                            ],
                        ],
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
            ]
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        externals: [
            (function () {
                var IGNORES = [
                    'electron'
                ];
                return function (context, request, callback) {
                    if (IGNORES.indexOf(request) >= 0) {
                        return callback(null, "require('" + request + "')");
                    }
                    return callback();
                };
            })()
        ]
    }
}