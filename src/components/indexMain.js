import React, { useEffect } from "react"
import { Link} from "gatsby"
import Img from "gatsby-image"
import SEO from "./seo"

const Index = ({data}) => {

  const posts = data.allWordpressPost.edges
  const comments = data.allWordpressWpComments.nodes

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
      itemSelector: ".post-container",
    })
  }, [])

  return (
    <div className="wrapper-inner section-inner">
      <SEO
        title={"web-forward"}
        description={
          "Der Blog für innovative Webtechnologien an der RWU Hochschule Ravensburg-Weingarten"
        }
      />
      <div className="content">
        <div className="posts" id={"posts-seite1"}>
          {
            //Alle Posts einzeln abarbeiten
            posts.map((element, index) => {
              // Nur 9 Elemente ausgeben
              if (index > 9) {
                return;
              }
              const node = element.node
              const media = node.featured_media

              const blogComments = comments.filter(x => {
                return x.post === node.wordpress_id
              })
              const numberComment = blogComments ? blogComments.length : 0

              return (
                <div key={node.wordpress_id} className="post-container">
                  <div
                    id={"post-" + node.wordpress_id}
                    className="post-219 post type-post status-publish format-standard has-post-thumbnail hentry category-webtechnologien"
                  >
                    <div className="featured-media">
                      {/* Ändern} */}
                      <Link to={node.slug} rel="bookmark" title={node.title}>
                        <Img
                          fluid={
                            node.featured_media.localFile.childImageSharp.fluid
                          }
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

                        <Link
                          className="post-meta-comments"
                          to={node.slug + "/#comments"}
                          title={"Kommentare zu Artikel: " + node.title}
                        >
                          <div className="genericon genericon-comment"></div>{" "}
                          {numberComment}{" "}
                        </Link>
                      </div>

                      <div className="clear"></div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className="archive-nav section-inner">
        <Link to={"/index2"} className="post-nav-older fleft">
          ← Ältere Beiträge
        </Link>

        <div className="clear"></div>
      </div>
    </div>)
  
}

export default Index
