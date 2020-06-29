import React, { Component } from "react"
import Layout from "../layout/layoutIndex"
import IndexMain from "../components/indexMain2"

class Homepage extends Component {
  render() {
    return (
  <Layout>
<IndexMain data={this.props.data}/>  
  </Layout>
    )
  }
}

export default Homepage

export const pageQuery = graphql`
  query {
    allWordpressPost {
      edges {
        node {
          date(formatString: "DD.MMMM YYYY")
          title
          slug
          excerpt
          wordpress_id
          featured_media {
            localFile {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            alt_text
          }
        }
      }
    }
    allWordpressWpComments {
      nodes {
        post
      }
    }
  }
`
