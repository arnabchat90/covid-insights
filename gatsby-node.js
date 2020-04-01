/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const fetch = require("node-fetch")
// const fs = require("fs")

async function retrieveData(url) {
  return await fetch(url)
    .then(res => res.text())
    .then(body => body)
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions
  const data = await retrieveData(
    "https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
  )
  console.log(typeof data)
  const jsonData = JSON.parse(data.trim())
  //   fs.appendFile("data.json", data, function(err) {
  //     if (err) throw err
  //     console.log("Saved!")
  //   })
  jsonData.records.forEach(element => {
    const node = {
      ...element,
      cases: parseInt(element.cases),
      id: createNodeId(`covid - ${element.geoId}- ${element.dateRep}`),
      internal: {
        type: "covid",
        contentDigest: createContentDigest(element),
      },
    }
    createNode(node)
  })

  return
}
