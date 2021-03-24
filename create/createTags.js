const { resolve } = require(`path`)
const chunk = require(`lodash/chunk`)

module.exports = async ({ actions, graphql }, options) => {
  const { perPage } = options

  const { data: tagData } = await graphql(/* GraphQL */ `
    {
      allWpTermNode {
        nodes {
          ... on WpTag {
            count
            uri
            databaseId
            link
            contentNodes {
              nodes {
                uri
                ... on WpPost {
                  id
                  title
                  excerpt
                }
              }
            }
          }
        }
      }
    }
  `)

  if (
    !tagData.allWpTermNode.nodes ||
    tagData.allWpTermNode.nodes.length === 0
  )
    return

  await Promise.all(
    tagData.allWpTermNode.nodes.map(async (tag, index) => {
      // making sure if the union objects are empty, that this doesn't go further (... on WpTag can produce empty {} objects)
      if (Object.keys(tag).length) {
        const { data } = await graphql(/* GraphQL */ `
          {
            allWpPost(
              filter: {
                tags: {
                  nodes: {
                    elemMatch: { databaseId: { eq: ${tag.databaseId} } }
                  }
                }
              }
              sort: { fields: date, order: DESC }
            ) {
              nodes {
                uri
                id
                date
              }
            }
            
          }
        `)

        if (!data.allWpPost.nodes || data.allWpPost.nodes.length === 0) return

        const chunkedContentNodes = chunk(data.allWpPost.nodes, perPage)

        const tagPath = tag.uri
        
        // const tagPath = tag.slug
        // this produced nice code error

        // const tagPath = tag.date

        await Promise.all(
          chunkedContentNodes.map(async (nodesChunk, index) => {
            const firstNode = nodesChunk[0]

            await actions.createPage({
              component: resolve(`./src/templates/archive.js`),
              path:
                index === 0
                  ? tagPath
                  : `${tagPath}page/${index + 1}/`,
              context: {
                firstId: firstNode.id,
                archiveType: "tag",
                archivePath: tagPath,
                tagDatabaseId: tag.databaseId,
                offset: perPage * index,
                pageNumber: index + 1,
                totalPages: chunkedContentNodes.length,
                perPage,
              },
            })
          })
        )
      }
    })
  )
}
