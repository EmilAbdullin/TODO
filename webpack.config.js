const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry:'./src/app.js',
    output:{
        filename:'main.bundle.js',
        path:path.resolve(__dirname, 'public')
    },
    devServer:{
        historyApiFallback:{
            index:'/'
        },
        port:3000
    },
    plugins:[
        new HTMLPlugin({
            template:'./src/index.html'
        })
    ],
    module:{
        rules:[
            {
                test:/\.css$/i,
                use:['style-loader','css-loader']
            }
        ]
    }
}