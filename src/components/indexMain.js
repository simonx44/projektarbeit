import React, { useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"


export function Index() {
  
  const data = useStaticQuery(pageQuery)
  const posts = data.allWordpressPost.edges


  useEffect(() => {
    
    const Masonry =
      typeof window !== `undefined` ? require("masonry-layout") : null
    if (!Masonry) {
      return
    }

    var container = document.querySelector(".posts")

    var msnry = new Masonry(container, {
      // options...
      columnWidth: ".post-container",
      itemSelector: ".post-container"
    })

   }, [])



  return (
   
    <div className="wrapper-inner section-inner">
      <div className="content">
        <div className="posts" id="posts">
          {posts.map((element, index) => {
         
            const node = element.node
            const media = node.featured_media
        

// Nur 9 Elemente ausgeben
if(index > 9){
  return (<></>);
}
            return (
              <div key={node} className="post-container">
                <div
                  id="post-219"
                  className="post-219 post type-post status-publish format-standard has-post-thumbnail hentry category-webtechnologien"
                >
                  <div className="featured-media">
                    {/* Ändern} */}
                    <Link to={node.slug} rel="bookmark" title={node.title}>
                      <Img
                      
                      fluid={node.featured_media.localFile.childImageSharp.fluid}
                        className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                        alt={media.alt_text}
                      />
                    </Link>
                  </div>

                  <div className="post-inner">
                    <div className="post-header">
                      <h2 className="post-title">
                        <Link
                          to={node.slug}
                          rel="bookmark"
                          title={node.title}
                          dangerouslySetInnerHTML={{ __html: node.title }}
                        />
                      </h2>
                    </div>

                    <p
                      className="post-excerpt"
                      dangerouslySetInnerHTML={{ __html: node.excerpt }}
                    />

                    <div className="post-meta">
                      <Link
                        className="post-meta-date"
                        to={node.slug}
                        rel="bookmark"
                        title={node.title}
                      >
                        <div className="genericon genericon-time">
                          {" "}
                          {node.date}
                        </div>
                      </Link>

                      {/* Anpassen 
    
     <a className="post-meta-comments" href="https://web-forward.de/2020/05/electron-desktop-anwendungen-leicht-gemacht/#comments" title="0 Kommentare zu Electron: Desktop-Anwendungen leicht gemacht">
                      
    <div className="genericon genericon-comment"></div>

    
    */}
                    </div>

                    <div className="clear"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="archive-nav section-inner">
      <Link to={"/index2"}
  className="post-nav-older fleft"
>← Ältere Beiträge</Link>
    
        <div className="clear"></div>
      </div>
    </div>
  )
} 

export default Index

export const pageQuery = graphql`
  query {
    allWordpressPost {
      edges {
        node {
          date(formatString: "DD.MMMM YYYY")
          title
          slug
          excerpt
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
  }
`
