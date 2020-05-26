const path = require(`path`)
const { slash } = require(`gatsby-core-utils`)
const Promise = require(`bluebird`)


 // query content for WordPress posts
 const postQuery = `
 {
  allWordpressPost {
    edges {
      node {
        id
        slug
        title
      }
      next {
        id
        slug
      }
      previous {
        id
        slug
      }
    }
  }
}
`

const pageQuery = `
 {
   allWordpressPage {
     edges {
       node {
         id
         slug
       }
     }
   }
 }
`

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

 

  return new Promise((resolve, reject) => {
    
    // Posts
    graphql(postQuery)
      .then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const postTemplate = path.resolve(`./src/templates/post.js`)
        result.data.allWordpressPost.edges.forEach(edge => {
          console.log(edge.node.title);
          createPage({
            // will be the url for the page
            path: edge.node.slug,  // /post/${edge.node.slug}/`,
            // specify the component template of your choice
            component: slash(postTemplate),
            // In the ^template's GraphQL query, 'id' will be available
            // as a GraphQL variable to query for this posts's data.
            context: {
              id: edge.node.id,
            },
          })
        })
      })

      .then(() => {

      
        graphql(pageQuery).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          console.log(result);
          console.log(result.data);
          console.log(result.data.allWordpressPage);

          const pageTemplate = path.resolve(`./src/templates/page.js`)
          result.data.allWordpressPage.edges.forEach(edge => {
            console.log(edge.node.id)
            createPage({
              // will be the url for the page
              path: edge.node.slug,
              // specify the component template of your choice
              component: slash(pageTemplate),
              // In the ^template's GraphQL query, 'id' will be available
              // as a GraphQL variable to query for this posts's data.
              context: {
                id: edge.node.id,
           

              },
            })
          })

          resolve();
        })
      }) 
  })
}
