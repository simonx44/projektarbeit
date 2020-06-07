import React, {useState, useEffect} from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import backgroundImage from "../images/background.jpg"

export default () => {
  const [isOpen, setIsOpen] = useState(false);




useEffect(() => {
  // Update the document title using the browser API
 
},[]);

  const data = useStaticQuery(pageQuery);
  const metaData = data.wordpressSiteMetadata;

  const pages = data.allWordpressPage.edges
  pages.sort((e1, e2) => {
    if (e1.node.slug > e2.node.slug) {
      return 1
    } else return -1
  })

  return (
    <>
      <div className="navigation">
        <div className="section-inner">
          <ul className="main-menu">
            <li key={"/home"} className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item">
              <Link to={`/`} aria-current={"page"}>
                Home
              </Link>
            </li>

            {pages.map(element => {
              if (element.node.slug === "impressum") return null

              return (
                <li key={element.node.slug}
            
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item"
                >
                  <Link to={`/` + element.node.slug}>{element.node.title}</Link>
                </li>
              )
            })}
          </ul>

          <div className="clear"></div>
        </div>

        <div className="mobile-menu-container" style={{display: isOpen ? 'block' : 'none'}}>

          <ul className="mobile-menu">
            <li className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item">
              <Link to={`/`} aria-current={"page"}>
                Home 
              </Link>
            </li>
            {pages.map(element => {
              if (element.node.slug === "impressum") return null

              return (
                <li key={"mobile"+element.node.slug}

                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item"
                >
                  <Link to={`/` + element.node.slug}>{element.node.title}</Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="title-section">
        <div
          className="bg-image master"
          style={{ backgroundImage: "url(" + backgroundImage + ")" }}
        ></div>

        <div className="bg-shader master"></div>

        <div className="section-inner">
          <div className="toggle-container">
            <Link
              className={`nav-toggle ${isOpen ? 'active' : ''}` }
              onClick={()=>{setIsOpen(!isOpen)}}
              title={"Hier klicken um die Navigation anzuzeigen"}
              to={"#"}
            >
              <div className="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>

                <div className="clear"></div>
              </div>

              <p>
                <span className="menu">Menü</span>
                <span className="close">Schließen</span>
              </p>

              <div className="clear"></div>
            </Link>
          </div>

          <h1 className="blog-title">
            <Link
              to={"/"}
              title={
               metaData.name +" "+metaData.description
              }
              rel={"home"} dangerouslySetInnerHTML={{ __html: metaData.name }}
            >
              
            </Link>
          </h1>

          <h3 className="blog-subtitle" dangerouslySetInnerHTML={{ __html: metaData.description }}/>
        
        </div>
      </div>
    </>
  )
}

export const pageQuery = 
graphql`
query{
  allWordpressPage {
    edges {
      node {
        id
        slug
        status
        template
        title
      }
    }
  }
  wordpressSiteMetadata {
    name
    description
  }
}
`
