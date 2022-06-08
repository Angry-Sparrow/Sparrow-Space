import type { GatsbyNode } from 'gatsby'
import path from 'path'

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }) => {
    const { createPage } = actions

    const docPostTemplate = path.resolve(`./src/templates/docTemplate.tsx`)

    return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `).then((result: any) => {
        if (result.errors) {
            return Promise.reject(result.errors)
        }

        return result.data.allMarkdownRemark.edges.forEach(({ node }: { node: any }) => {
            createPage({
                path: node.frontmatter.slug,
                component: docPostTemplate,
                context: {
                    // additional data can be passed via context
                    slug: node.frontmatter.slug,
                },
            })
        })
    })
}
