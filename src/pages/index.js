import React, { Component } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../layout/layoutIndex"
import IndexMain from "../components/indexMain"

class Homepage extends Component {
  render() {
    return (
  <Layout>
<IndexMain/>  
  </Layout>
    )
  }
}

export default Homepage

