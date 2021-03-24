import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"

// const TagIndex = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>


const TagIndex = ({ data }) => {
    return (
        <Layout>
      <div>
       TAGS:
        {data.allWpTag.nodes.map(node => <div><a href={node.uri}>{node.name}</a> ({node.count}) </div>)}
      </div>
      </Layout>
    )
  }


export default TagIndex

export const query = graphql`
query TagsQuery {
    allWpTag {
      nodes {
        slug
        count
        link
        name
        description
        databaseId
        id
        uri
      }
    }
  }
`
