import React from "react"
import Layout from "../layout/layoutPage"
import SEO from "../components/seo"

export default ({ data }) => {
  const currentPage = data.wordpressPage

  return (
    <Layout>
       <SEO title={ currentPage.title} description={currentPage.excerpt} />
      <div className="post">
        <div className="post-inner">
          <div className="post-header">
            <h1 className="post-title">{currentPage.title}</h1>
          </div>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: currentPage.content }}
          />
          <div className="clear"></div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query pageQuery($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      content
      id
      excerpt
      slug
    }
  }
`


