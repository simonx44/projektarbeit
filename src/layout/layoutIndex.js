import React from "react"
import { Link } from "gatsby"

import Header from "../components/header"
import Footer from "../components/footer"

const Layout = ({ children }) => {



  return (
    <div className="home blog has-featured-image home-first-page">
      <Header></Header>
      <div className="wrapper">
            {children}
         </div>   
      <Footer/>
    </div>
  )
}

export default Layout
