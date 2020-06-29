import React, { useState, useEffect } from "react"
import Layout from "../layout/layoutBlog"
import Image from "gatsby-image"
import { Link } from "gatsby"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import userPic from "../images/user.png"
import $ from "jquery"

let siteUrl = null
siteUrl = typeof window !== `undefined` ? window.location.href : null;
/* Zugriff auf Wordpress API */

//const ACTION_URL = "http://blog.local/wp-json/wp/v2/comments"
const ACTION_URL = "https://web-forward.de/wp-json/wp/v2/comments";

//       FUNCTION
// Function: Erstellt Kommentar
//   Parameter: commentData (Object): Kommentardaten 
// Rückgabe: JSX Objekt mit erzeugtem Kommentar
const createComment = commentData => {
 
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ]

  var d = new Date(commentData.date)

  var commentDate =
    ("0" + d.getDate()).slice(-2) +
    ". " +
    monthNames[d.getMonth()] +
    " " +
    d.getFullYear()
  var commenttime =
    +("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)

  var content = commentData.content.rendered;

  var readyComment = (
    <li key={commentData.id}
      className="comment byuser comment-author even thread-even depth-1"
      id="li-comment-2"
    >
      <div id="comment-2" className="comment">
        <img
          alt=""
          src={userPic}
          srcSet={userPic}
          className="avatar avatar-80 photo"
          height="80"
          width="80"
        />

        <div className="comment-inner">
          <div className="comment-header">
            <h4>{commentData.author_name}</h4>

            <p>
              {commentDate}
              <span>{" - " + commenttime}</span>
            </p>
          </div>

          <div className="comment-content post-content">
            <p dangerouslySetInnerHTML={{ __html: content }} />
          </div>

          <div className="comment-actions">
            <a
              rel="nofollow"
              className="comment-reply-link"
              href="#comment"
              data-commentid={commentData.id}
              data-postid={commentData.post}
              data-respondelement="respond"
              aria-label={"Reply to " + commentData.author_name}
            >
              {commentData.type === "new" ? "Warte auf Freischaltung" : "Antworten"}
            </a>
            <div className="clear"></div>
          </div>
        </div>
      </div>
    </li>
  )

  return readyComment
}
//       FUNCTION
// Function: Erstellt Kommentar
// Funktionniert noch nicht mit hinterlegter URL ->
// add_filter( 'rest_allow_anonymous_comments', '__return_true' );
// muss in function.php aufgenommen werden (Wordpress)
//   Parameter: event (Submit) --> beeinhaltet Form-Daten
// Rückgabe: JSX Objekt mit erzeugtem Kommentar 
const postComment = event => {
  const [
    comment,
    author,
    email,
    url,
    cookies,
    submit,
    postid,
    parents,
  ] = event.target.elements

  const newComment = JSON.stringify({
    post: postid.value,
    author_name: author.value,
    author_email: email.value,
    content: comment.value,
  })

  const siteComment = {
    post: postid.value,
    author_name: author.value,
    content: { rendered: comment.value },
    date: new Date(),
    type: "new",
  }

   fetch(ACTION_URL, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: newComment,
})
  .then((response) => {
    
    if (response.ok === true) {
      // Submitted successfully!
   
    }
    return response.json();
  })
  .then((object) => {
    // Comment submission failed.
    // Output `object.message` to see the error message.
  })
  .catch(error => console.error('Error:', error)); 

   // Bestehende Eingabe löschen
  $("#commentform")[0].reset();
  return createComment(siteComment)
}


// Graphql Daten verarbeiten

//       FUNCTION
// Function: Vorgänger-Blog zum Post beschaffen
//   Parameter: posts -> Alle Posts der Seite, id -> blog-ID
// Rückgabe: Vorgänger Post

const getPrevious = (posts, id) => {
  let previousPost = posts.filter(element => {
    return element.node.id === id
  })

  return previousPost.length > 0 ? previousPost.pop().previous : null
}


//       FUNCTION
// Function: Vorgänger-Blog zum Post beschaffen
//   Parameter: posts -> Alle Posts der Seite, id -> blog-ID
// Rückgabe: Nachfolger Post
const getNext = (posts, id) => {
  let nextPost = posts.filter(element => {
    return element.node.id === id
  })

  return nextPost.length > 0 ? nextPost.pop().next : null
}

//       FUNCTION
// Function: Beschafft alle Posts eines Autors
//   Parameter: posts -> Alle Posts der Seite, authorId -> Id des Authors
// Rückgabe: Posts vom Author
const getAllPostsOfAuthor = (posts, authorId) => {
  return posts.filter(element => {
    return element.node.author.id === authorId
  })
}


//     FUNCTION
// Function: Wird für den Gatsby-Build Prozess benötigt, da währenddessen kein Zugriff auf document oder window möglich ist
//           Problematik kann so umgangen werden (Gatsby doc)


const getText = html => {
  if (typeof document == `undefined`) {
    return ""
  }
  var tmp = document.createElement("DIV")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}




// React Komponente

export default ({ data }) => {
//REACT STATE
  const [reiter, setReiter] = useState(3); // Reiter zum Wechseln zwischen Kommentarbereich, Beitragsinfo, Autoreninfo
  const [comments, setComments] = useState(null) // API - Beschaffung der Kommentare über get-Request
  const [addedComments, setAddedComments] = useState([]) // Neuer Kommentar hinzufügen



  /* data from graphql */
  const currentPage = data.wordpressPost
  const author = currentPage.author
  const allPosts = data.allWordpressPost.edges

  // weitere Daten auslesen: Vorgänger, Nachfolger, Autorbeiträge
  const previous = getPrevious(allPosts, currentPage.id)
  const next = getNext(allPosts, currentPage.id)
  const authorPosts = getAllPostsOfAuthor(allPosts, author.id)
  const pic = currentPage.featured_media.localFile.childImageSharp.fluid

  const wpId = currentPage.wordpress_id; // 52 // Testzweck -> 

  // React HOOK -> wird nach jedem Render aufgerufen
  useEffect(() => {

    //Kommentare der Api beschaffen
    const loadComment = id => {
      // document.addEventListener('DOMContentLoaded', function() {

      //Daten von API beschaffen
      return fetch(ACTION_URL + "?post=" + id)
        .then(response => response.json())
        .then(data => {
          setComments(data)
          return data
        })
    }
    loadComment(wpId)
  }, [wpId])

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

            <h1 className="post-title" dangerouslySetInnerHTML={{__html: currentPage.title}}/>
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
              <li key={"comment"}>
                <Link
                  to={"/"}
                  className={`${reiter === 3 ? "active" : ""} tab-comments-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(3)
                  }}
                >
                  <div className="genericon genericon-comment"></div>
                  <span>Kommentare</span>
                </Link>
              </li>
              <li key={"autorinfo"}>
                <Link
                  to={"/"}
                  className={`${reiter === 1 ? "active" : ""} tab-post-meta-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(1)
                  }}
                >
                  <div className="genericon genericon-summary"></div>
                  <span>Beitragsinfo</span>
                </Link>
              </li>
              <li key={"postinfo"}>
                <Link
                  to={"/"}
                  className={`${
                    reiter === 2 ? "active" : ""
                  } tab-author-meta-toggle`}
                  onClick={event => {
                    event.preventDefault()
                    setReiter(2)
                  }}
                >
                  <div className="genericon genericon-user"></div>
                  <span>Autoreninfo</span>
                </Link>
              </li>

              <div className="clear"></div>
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
                  <li key={"user-icon"}>
                    <div className="genericon genericon-user"></div>
                    <Link
                       to={"/"}
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
                  <li key={"blog-time"}>
                    <div className="genericon genericon-time"></div>
                    <Link to={"/"} title={""}>
                      {currentPage.date}
                    </Link>
                  </li>
                  <li key={"blog-cat"}>
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
                <div className="author-meta-inner">
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
                          return;
                        }
            

                        return (
                          <li key={element.node.id} className="has-thumb">
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
              <div
                className="tab-comments tab"
                style={{ display: reiter === 3 ? "block" : "none" }}
              >
                {/* Dynamischer Kommentarbereich */}
                <div className="comments">
                  <a name="comments"></a>

                  <div className="comments-title-container">
                    <h2 className="comments-title fleft">
                      {comments
                        ? comments.length == 1
                          ? "1 Kommentar"
                          : comments.length + " Kommentare"
                        : "0 Kommentare"}
                    </h2>

                    <h2 className="comments-subtitle fright">
                      <a href="#respond">Add yours →</a>
                    </h2>

                    <div className="clear"></div>
                  </div>
                  <ol className="commentlist">
                    {/* Kommentare von API */}
                    {comments &&
                      comments.map(element => {
                        return createComment(element)
                        
                      })}
                    {/* Neu hinzugefügte Kommentare */}
                    {addedComments.length > 0 &&
                      addedComments.map(comment => {
                        return comment
                      })}
                  </ol>
                </div>

                <div id="respond" className="comment-respond">
                  <h3 id="reply-title" className="comment-reply-title">
                    Schreibe einen Kommentar
                    <small>
                      <Link
                        rel="nofollow"
                        id="cancel-comment-reply-link"
                        to={
                          "/2020/01/progressive-web-apps-die-zukunft-nativer-applikationen/#respond"
                        }
                        style={{ display: "none" }}
                      >
                        Antworten abbrechen
                      </Link>
                    </small>
                  </h3>

                  <form
                    onSubmit={event => {
                      event.preventDefault()
                      var currentComment = postComment(event)
                      setAddedComments([...addedComments, currentComment])

                    }}
                    //method="post"
                    id="commentform"
                    className="comment-form"
                  >
                    <p className="comment-notes">
                      Deine E-Mail-Adresse wird nicht veröffentlicht.
                    </p>
                    <p className="comment-form-comment">
                      <label htmlFor="comment">Kommentar</label>
                      <textarea
                        id="comment"
                        name="comment"
                        cols="45"
                        rows="6"
                        required=""
                      ></textarea>
                    </p>
                    <p className="comment-form-author">
                      <label htmlFor="author">
                        Name <span className="required">*</span>
                      </label>
                      <input
                        id="author"
                        name="author"
                        type="text"
                        size="30"
                        maxLength="245"
                        required="required"
                      />
                    </p>
                    <p className="comment-form-email">
                      <label htmlFor="email">
                        E-Mail <span className="required">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        size="30"
                        maxLength="100"
                        required="required"
                      />
                    </p>
                    <p className="comment-form-url">
                      <label htmlFor="url">Website</label>
                      <input
                        id="url"
                        name="url"
                        type="text"
                        size="30"
                        maxLength="200"
                      />
                    </p>
                    <p className="comment-form-cookies-consent">
                      <input
                        id="wp-comment-cookies-consent"
                        name="wp-comment-cookies-consent"
                        type="checkbox"
                      />
                      <label htmlFor="wp-comment-cookies-consent">
                        Meinen Namen, E-Mail und Website in diesem Browser
                        speichern, bis ich wieder kommentiere.
                      </label>
                    </p>
                    <p className="form-submit">
                      <input
                        name="submit"
                        type="submit"
                        id="submit"
                        className="submit"
                        value="Kommentar abschicken"
                      />
                      <input
                        type="hidden"
                        name="comment_post_ID"
                        value={currentPage.wordpress_id}
                        id="comment_post_ID"
                      />
                      <input
                        type="hidden"
                        name="comment_parent"
                        id="comment_parent"
                        value="0"
                      />
                    </p>
                  </form>
                  {/* Direkt ohne Form */}
                </div>
              </div>

              {/* Ende */}
            </div>
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
      wordpress_id
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
