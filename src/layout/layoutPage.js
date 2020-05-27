import React from "react"


import Header from "../components/header"
import Footer from "../components/footer"

const Layout = ({ children }) => {
  return (
    <div className="page-template-default page page-id-31 no-featured-image single-post">
      <Header></Header>
      <div className="wrapper">
        <div className="wrapper-inner section-inner thin">
          <div className="content">
            {children}
            {}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Layout
