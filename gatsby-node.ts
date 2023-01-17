import type { Actions } from 'gatsby'

exports.onCreateWebpackConfig = ({ actions }: { actions: Actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: false, // ammo.js seems to also use path
      },
    },
  })
}
