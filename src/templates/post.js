import React, { useState, useEffect } from "react"
import Layout from "../layout/layoutBlog"
import Image from "gatsby-image"
import { Link } from "gatsby"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import userPic from "../images/user.png"

//Vorgänger beschaffen
const getPrevious = (posts, id) => {
  let previousPost = posts.filter(element => {
    return element.node.id === id
  })

  return previousPost.length > 0 ? previousPost.pop().previous : null
}
//Nachfolger beschaffen
const getNext = (posts, id) => {
  let nextPost = posts.filter(element => {
    return element.node.id === id
  })

  return nextPost.length > 0 ? nextPost.pop().next : null
}

// Beiträge eines Autors

const getAllPostsOfAuthor = (posts, authorId) => {
  return posts.filter(element => {
    return element.node.author.id === authorId
  })
}

// Methode benötigt für den Bild-Prozess
// Währendessen kein Zugriff auf window,document -> muss umgangen werden
const getText = html => {
  if (typeof document == `undefined`) {
    return ""
  }
  var tmp = document.createElement("DIV")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

export default ({ data }) => {
  const [reiter, setReiter] = useState(1)

  //Daten aus graphql
  const currentPage = data.wordpressPost
  const author = currentPage.author
  const allPosts = data.allWordpressPost.edges

  const pic = currentPage.featured_media.localFile.childImageSharp.fluid

  // weitere Daten auslesen: Vorgänger, Nachfolger, Autorbeiträge
  const previous = getPrevious(allPosts, currentPage.id)
  const next = getNext(allPosts, currentPage.id)
  const authorPosts = getAllPostsOfAuthor(allPosts, author.id)
  console.log(getText(currentPage.excerpt))

  let siteUrl = null
  siteUrl = typeof window !== `undefined` ? window.location.href : null
  useEffect(() => {
    // Update the document title using the browser API
  }, [reiter])

  return (
    <Layout>
      <SEO
        title={getText(currentPage.title)}
        description={getText(currentPage.excerpt)}
      />
      <div
        className={
          "post post type-post status-publish format-standard has-post-thumbnail hentry " +
          currentPage.categories[0].name
        }
      >
        {/* 1.Blog: Bild */}
        <div className="featured-media">
          <Image
            className="attachment-post-image size-post-image wp-post-image"
            fluid={pic}
          />
        </div>
        {/* featured-media */}
        {/* 2.Blog: Inner Post */}
        <div className="post-inner">
          <div className="post-header">
            <p className="post-date">{currentPage.date}</p>

            <h1 className="post-title">{currentPage.title}</h1>
          </div>
          {/*.post-header */}

          <div className="post-content">
            {/*}  Social Icons -> To-Do  -> Einfügen*/}
            <div className="simplesocialbuttons simplesocial-round-icon simplesocialbuttons_inline simplesocialbuttons-align-left post-267 post  simplesocialbuttons-inline-no-animation simplesocialbuttons-inline-in">
              <button
                aria-label="whatsapp"
                onClick={() => {
                  let link =
                    "https://web.whatsapp.com/send?text=" + window.location.href
                  window.open(link, "_blank")
                  return false
                }}
                className="simplesocial-whatsapp-share"
                data-href={"https://web.whatsapp.com/send?text=" + siteUrl}
              >
                <span className="simplesocialtxt">WhatsApp</span>
              </button>
              <button
                aria-label="twitter"
                className="simplesocial-twt-share"
                data-href={
                  "https://twitter.com/share?text=" + currentPage.title + "&url"
                }
                rel="nofollow"
                onClick={() => {
                  let link =
                    "https://twitter.com/share?text=" +
                    currentPage.title +
                    "&url" +
                    window.location.href
                  window.open(
                    link,
                    "",
                    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600"
                  )
                  return false
                }}
              >
                <span className="simplesocialtxt">Twitter</span>
              </button>
              <button
                aria-label="Facebook"
                className="simplesocial-fb-share"
                target="_blank"
                data-href={"https://www.facebook.com/sharer/sharer.php?u="}
                onClick={() => {
                  let link = "https://www.facebook.com/sharer/sharer.php?u="

                  window.open(
                    link,
                    "",
                    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600"
                  )
                  return false
                }}
              >
                <span className="simplesocialtxt">Facebook </span>
              </button>
              <button
                aria-label="Mail"
                onClick={() => {
                  let link =
                    "mailto:?subject=" +
                    currentPage.title +
                    "&body" +
                    window.location.href
                  window.location.href = link
                  return false
                }}
                className="simplesocial-email-share"
                data-href={"mailto:?subject="}
              >
                <span className="simplesocialtxt">Email</span>
              </button>
            </div>

            <div dangerouslySetInnerHTML={{ __html: currentPage.content }} />

            <div className="clear"></div>
          </div>
          {/* .post-content */}
        </div>
        {/* 3.Blog: Post-meta */}
        <div className="post-meta botton">
          {/* 3.1 Tab-Selektor */}
          <div className="tab-selector">
            <ul>
              <li>
                <Link
                  class={`${reiter === 3 ? "active" : ""} tab-comments-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(3)
                  }}
                >
                  <div class="genericon genericon-comment"></div>
                  <span>Kommentare</span>
                </Link>
              </li>
              <li>
                <Link
                  class={`${reiter === 1 ? "active" : ""} tab-post-meta-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(1)
                  }}
                >
                  <div class="genericon genericon-summary"></div>
                  <span>Beitragsinfo</span>
                </Link>
              </li>
              <li>
                <Link
                  class={`${
                    reiter === 2 ? "active" : ""
                  } tab-author-meta-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(2)
                  }}
                >
                  <div class="genericon genericon-user"></div>
                  <span>Autoreninfo</span>
                </Link>
              </li>

              <div class="clear"></div>
            </ul>
          </div>
          {/* 3.2 Tabs - Content */}
          <div className="post-meta-tabs">
            {/* 3.2.1 Inner */}
            <div className="post-meta-tabs-inner">
              {/* 3.2.1 Inner */}
              {/* Tab 1 Autoreninfo: Status einfügen-> react*/}
              <div
                className="tab-post-meta tab"
                style={{ display: reiter === 1 ? "block" : "none" }}
              >
                <ul className="post-info-items fright">
                  <li>
                    <div className="genericon genericon-user"></div>
                    <Link
                      onClick={
                        //Bei Bedarf hinzufügen"
                        event => {
                          event.defaultPrevented()
                        }
                      }
                      title={"Beiträge von " + author.name}
                      rel="author"
                    >
                      {author.name}
                    </Link>
                  </li>
                  <li>
                    <div className="genericon genericon-time"></div>
                    <Link to={"/"} title={""}>
                      {currentPage.date}
                    </Link>
                  </li>
                  <li>
                    <div className="genericon genericon-category"></div>
                    <Link to={"/"} rel="category tag">
                      {currentPage.categories[0].name}
                    </Link>
                  </li>
                </ul>

                <div className="post-nav fleft">
                  {previous && (
                    <Link
                      className="post-nav-prev"
                      title={previous.title}
                      to={"/" + previous.slug}
                    >
                      <p>Vorheriger Beitrag</p>
                      <h4
                        dangerouslySetInnerHTML={{ __html: previous.title }}
                      />
                    </Link>
                  )}

                  {next && (
                    <Link
                      className="post-nav-next"
                      title={next.title}
                      to={"/" + next.slug}
                    >
                      <p>Nächster Beitrag</p>

                      <h4 dangerouslySetInnerHTML={{ __html: next.title }} />
                    </Link>
                  )}
                </div>

                <div className="clear"></div>
              </div>

              {/* Tab 3 Autoreninfo:*/}
              <div
                className="tab-author-meta tab"
                style={{ display: reiter === 2 ? "block" : "none" }}
              >
                <Link to={"/" /* evtl. anpassen */} className="author-avatar">
                  <img
                    src={userPic}
                    //src={author.authored_wordpress__wp_media[0].localFile.childImageSharp.resolutions.src}
                    className="avatar avatar-256 photo"
                    height="256"
                    width="256"
                    alt="Userpic"
                  />
                </Link>
                {/* Autoreninfo*/}
                <div class="author-meta-inner">
                  <h3 className="author-name">
                    <Link
                      to={""} /*Anpassen */
                      title={"Beiträge von " + author.name}
                      rel="author"
                    >
                      {author.name}
                    </Link>
                  </h3>
                  {/* rolle konnte nicht gefunden werden */}
                  <p className="author-position">Administrator</p>
                </div>
                {/* content */}
                <div className="author-content">
                  <div className="one-half author-posts">
                    <h4 className="content-by">
                      {"Beiträge von " + author.name}
                    </h4>

                    <ul>
                      {authorPosts.map((element, index) => {
                        if (index >= 5) {
                          return <></>
                        }

                        return (
                          <li className="has-thumb">
                            <Link
                              to={"/" + element.node.slug}
                              title={element.node.title}
                            >
                              <div className="post-icon">
                                <Image
                                  fluid={
                                    element.node.featured_media.localFile
                                      .childImageSharp.fluid
                                  }
                                />
                              </div>

                              <h5
                                className="title"
                                dangerouslySetInnerHTML={{
                                  __html: element.node.title,
                                }}
                              />

                              <p className="meta">{element.node.date}</p>

                              <div className="clear"></div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Kommentare */}
                  <div className="one-half author-comments">
                    <h4 className="content-by">Kommentare von hofmeister</h4>

                    <ul></ul>
                  </div>

                  <div className="clear"></div>
                </div>
              </div>
              {/* content */}
            </div>
            {/* Tab 3 Kommentare Status einfügen-> react*/}

            {/* Kommentar -Ende */}
          </div>
          {/* 3.2 Tabs - Content */}
          {/* 3.2 Tabs*/}
        </div>
        {/* 3.Blog*/}
        {/* Navigation */}

        <div className="post-nav-fixed">
          {previous && (
            <Link
              className="post-nav-prev"
              title={previous.title}
              to={"/" + previous.slug}
            >
              <span className="hidden">Vorheriger Beitrag</span>
              <span className="arrow">«</span>
            </Link>
          )}
          {next && (
            <Link
              className="post-nav-next"
              title={next.title}
              to={"/" + next.slug}
            >
              <span className="hidden">Nächster Beitrag</span>
              <span className="arrow">»</span>
            </Link>
          )}

          <div className="clear"></div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query currentPageQuery($id: String) {
    allWordpressPost {
      edges {
        node {
          id
          title
          date(formatString: "DD.MMMM YYYY")
          featured_media {
            localFile {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          author {
            id
            name
          }
        }
        next {
          slug
          id
          title
        }
        previous {
          id
          slug
          title
        }
      }
    }
    wordpressPost(id: { eq: $id }) {
      template
      title
      slug
      id
      excerpt
      content
      author {
        name
        id
      }
      date(formatString: "DD.MMMM YYYY")
      categories {
        name
      }
      featured_media {
        localFile {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
