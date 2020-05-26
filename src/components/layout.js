/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Link } from "gatsby"

import Header from "./header"

const Layout = ({ children }) => {
  /*const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  */

  return (
    <div className="home blog has-featured-image home-first-page">
      <Header></Header>
      <div className="wrapper">
        <div className="wrapper-inner section-inner thin">
          <div className="content">
            {children}
            {}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
