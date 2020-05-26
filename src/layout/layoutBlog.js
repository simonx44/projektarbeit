import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"

const Layout = ({ children }) => {



  return (
    <div className="post-template-default single single-post postid-219 single-format-standard has-featured-image">
      <Header></Header>
      <div className="wrapper">
        <div className="wrapper-inner section-inner thin">
          <div className="content">
            {children}
          </div>
        </div>
      </div>
<Footer/>
    </div>
  )
}

export default Layout
