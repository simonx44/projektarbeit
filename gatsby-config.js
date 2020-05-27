const SITEURL = "https://www.web-forward.de"

const path = require(`path`)
module.exports = {
  siteMetadata: {
    title: `web-forward`,
    description: `Der Blog für innovative Webtechnologien an der RWU Hochschule Ravensburg-Weingarten`,
    author: `Simon Schwegler, Oliver Hagel`,
    siteUrl: SITEURL
  },
  plugins: [
    {
      /*
Plugin dient für mobile Nutzung
User kann Seite als Verknüpfung auf den hauptscreen ziehen
Zudem: - icon erstellung
       - Cache ....
      - Sprache durch Lokalisierung
      https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-manifest/README.md
      */
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `web-forward`,
        short_name: `web-forward`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        icon: `src/images/icon.png`,
        icons: [
          {
            src: `/cropped-favicon-180x180.png`,
            sizes: `180x180`,
            type: `image/png`,
          },
          {
            src: `/cropped-favicon-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
        ],
        display: `standalone`,
      },
    },
    /* stellt offline Funktionen zur Verfügung, bei schlechter Verbinding werden alle Daten vorgeladen*/
    `gatsby-plugin-offline`,
    /* */
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      /*  Datenquelle WP konfigurieren  */
      resolve: `gatsby-source-wordpress`,
      options: {
        baseUrl: `web-forward.de`,
        protocol: `https`,
        restApiRoutePrefix: "wp-json",
        hostingWPCOM: false,
        useACF: true,
      },
    },

    // Einstellungen für die robot.txt
    // sitemap erstellen mit allen Seiteninformationen
    
      `gatsby-plugin-sitemap`,
      'gatsby-plugin-robots-txt'
    

  ],
}
