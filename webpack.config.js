const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const allHtmlPlugins = [];
const locales = [
	{ code: 'en', file: 'en.json' },
	{ code: 'ua', file: 'ua.json' },
	{ code: 'fr', file: 'fr.json' },
];

const getLocalesData = (locale) => {
	const { code, file } = locale;
	const langFilePath = path.resolve(__dirname, `./locales/${file}`);
	const data = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));

	return data;
};

locales.forEach((locale) => {
	const { code, file } = locale;
	const data = getLocalesData(locale);
	console.log(code, ':', data);

	const htmlPlugin = new HtmlWebpackPlugin({
		template: path.resolve(__dirname, 'views', 'pages', 'home', 'index.pug'),
		filename: `${code}/index.html`,
		data: data,
		cache: false,
	});
	allHtmlPlugins.push(htmlPlugin);
});

module.exports = {
	mode: 'production',
	entry: {
		index: path.resolve(__dirname, 'app', 'index.js'),
	},
	output: {
		path: path.join(__dirname, 'public'),
		filename: '[name][contenthash].js',
		assetModuleFilename: '[name][ext]',
		publicPath: '/',
	},

	devtool: 'inline-source-map',
	devServer: {
		contentBase: './public',
		hot: true,
		port: 9000,
	},

	plugins: [new CleanWebpackPlugin(), ...allHtmlPlugins],
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: '@webdiscus/pug-loader',
						options: {
							method: 'render',
						},
					},
				],
			},
		],
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public'),
	},
};
