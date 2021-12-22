const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
    autoprefixer = require('autoprefixer')

module.exports = {
    entry: {
        futurplace: './src/js/futurplace.js'
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: './assets/js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: {
                            publicPath: '/'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [autoprefixer];
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico|woff2?|pdf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]',
                            publicPath(file, resourcePath, context) {
                                const relativePath = path.relative(context, resourcePath)

                                let url = relativePath.split('\\')
                                url.shift()

                                // return `${url.join('/')}`
                                return `/${url.join('/')}`
                            },
                            outputPath(file, resourcePath, context) {
                                const relativePath = path.relative(context, resourcePath)

                                let url = relativePath.split('\\')
                                url.shift()

                                return `${url.join('/')}`
                                // return `/${url.join('/')}`
                            },
                        }
                    }
                ]
            },
        ]
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: './assets/css/futurplace.css',
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/html/index.html',
            hash: true,
        }),
        new HtmlWebpackPlugin({
            filename: './nosotros/index.html',
            template: './src/html/pages/nosotros.html',
            hash: true,
        }),
        new HtmlWebpackPlugin({
            filename: './servicios/index.html',
            template: './src/html/pages/servicios.html',
            hash: true,
        }),
        new HtmlWebpackPlugin({
            filename: './busqueda/index.html',
            template: './src/html/pages/busqueda.html',
            hash: true,
        }),
        new HtmlWebpackPlugin({
            filename: './inmueble/index.html',
            template: './src/html/pages/inmueble.html',
            hash: true,
        })
    ]
}