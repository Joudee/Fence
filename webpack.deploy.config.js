var webpack = require('webpack')
var CleanPlugin = require('clean-webpack-plugin')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

// plugins
plugins = [
	new ExtractTextPlugin("styles.css"),

	new webpack.optimize.DedupePlugin(),//重复的代码不被大包到bundle文件里面
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),//合并重复请求
	new webpack.optimize.MinChunkSizePlugin({//合并重复请求
		minChunkSize: 51200, // ~50kb
	}),

	// This plugin minifies all the Javascript code of the final bundle
	new webpack.optimize.UglifyJsPlugin({
		mangle: true,
		comments: false,
		compress: {
			warnings: false, // Suppress uglification warnings
		},
	}),

	// This plugins defines various variables that we can set to false
	// in production to avoid code related to them from being compiled
	// in our final bundle
	new webpack.DefinePlugin({
		__SERVER__: false,
		__DEVELOPMENT__: false,
		__DEVTOOLS__: false,
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
]

module.exports = {
	debug: false,
	entry: [
        './src/client.jsx'
    ],
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
		}, {
			test: /\.css$/,
			loaders: ["style", "css"]
		}, {
			test: /\.less$/,
			loaders: ["style", "css",'less']
		},{
			test: /\.(ttf|eot|woff(2)?)(\?(t=)?[a-z0-9]+)?$/,
			loader: 'url?limit=50000&hash=sha512&digest=hex&name=[hash].[ext]'
		}, {
			test: /\.(svg?)(\?(t=)?[a-z0-9]+)$/,
			loader: 'url?limit=50000&hash=sha512&digest=hex&name=[hash].[ext]'
		}, {
			test: /\.svg$/,
			loader: 'svg-inline'
		}, {
			test: /\.(jpeg|jpg|png|gif)$/i,
			loaders: [
				'file?hash=sha512&digest=hex&name=[hash].[ext]',
				'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
			]
		}, {
			test: /\.mp3$/,
			loaders: [
				'file?hash=sha512&digest=hex&name=[hash].[ext]',
			]
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: __dirname + '/dist',
		publicPath: './',
		filename: 'bundle.js'
	},
	plugins: plugins,
	devtool: false,
}
