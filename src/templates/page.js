import React, { Component } from "react"
import Layout from "../layout/layoutPage"
import Img from "gatsby-image"
import SEO from "../components/seo"

export default ({ data }) => {
  const currentPage = data.wordpressPage

  return (
    <Layout>
       <SEO title={ currentPage.title} description={currentPage.excerpt} />
      <div class="post">
        <div class="post-inner">
          <div class="post-header">
            <h1 class="post-title">{currentPage.title}</h1>
          </div>

          <div
            class="post-content"
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


