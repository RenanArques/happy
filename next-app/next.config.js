const withImages = require('next-images')
module.exports = withImages({
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
    })

    return config
  },
})
