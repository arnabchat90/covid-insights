import React from "react"
import { Link } from "gatsby"
import WorldMap from "../components/worldmap"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import CustomizedTables from "../components/table"

const IndexPage = () => (
  <Layout>
    <SEO title="Dashboard" />
    <h1>COVID-19 Dashboard</h1>
    <h4>World Heat Map for new cases today -</h4>
    <WorldMap />
    <CustomizedTables />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
