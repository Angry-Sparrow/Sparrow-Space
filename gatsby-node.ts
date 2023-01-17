import type { Actions, WebpackLoaders, CreateBabelConfigArgs } from 'gatsby'

exports.onCreateWebpackConfig = ({
  actions,
  stage,
  loaders,
}: {
  actions: Actions
  stage: CreateBabelConfigArgs['stage']
  loaders: WebpackLoaders
}) => {
  const config = {
    resolve: {
      fallback: {
        fs: false,
        path: false, // ammo.js seems to also use path
      },
    },
  }

  if (stage === 'build-html' || stage === 'develop-html') {
    Object.assign(config,{
      module: {
        rules: [
          {
            test: /three/,
            use: loaders.null(),
          },
        ],
      },
    })
  }

  actions.setWebpackConfig(config)
}
