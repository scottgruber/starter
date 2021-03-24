import React from "react"
import { Link } from "gatsby"

const PostTags = ({ tags }) => {
  if (!tags?.nodes || tags.nodes === 0) return null

  return (
    <div className="entry-tags">
      <span className="screen-reader-text">Tags</span>
      <div className="entry-tags-inner">
        {tags.nodes.map((tag, index) => (
          <Link to={tag.uri} key={index} rel="tag tag">
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostTags
