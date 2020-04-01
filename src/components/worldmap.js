import { withFauxDOM } from "react-faux-dom"
import React, { useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as d3 from "d3"
import * as topojson from "topojson"
import worldData from "../../data/world_countries"
import Legend from "./legend"

let svg, color, path

export function ready(error, data, allCovid) {
  var populationById = {}
  if (allCovid && allCovid.group && allCovid.group.length > 0) {
    allCovid.group.forEach(function(d) {
      populationById[d.fieldValue] = +d.nodes[0].cases
    })
    data.features.forEach(function(d) {
      d.population = populationById[d.id]
    })
  }

  svg
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) {
      return color(populationById[d.id])
    })
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    // tooltips
    .style("stroke", "white")
    .style("stroke-width", 0.3)
    .on("mouseover", function(d) {
      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3)
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style("stroke-width", 0.3)
    })

  svg
    .append("path")
    .datum(
      topojson.mesh(data.features, function(a, b) {
        return a.id !== b.id
      })
    )
    // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
    .attr("class", "names")
    .attr("d", path)
}

export function WorldMap({ connectFauxDOM, chart }) {
  const data = useStaticQuery(graphql`
    {
      allCovid {
        totalCount
        group(field: countryterritoryCode) {
          fieldValue
          totalCount
          nodes {
            countriesAndTerritories
            cases
            dateRep
            deaths
            geoId
            countryterritoryCode
          }
        }
      }
    }
  `)
  const spectrum = [
    "rgb(22, 204, 50)",
    "rgb(140, 204, 22)",
    "rgb(195, 204, 22)",
    "rgb(214, 198, 22)",
    "rgb(214, 162, 22)",
    "rgb(214, 137, 22)",
    "rgb(214, 98, 22)",
    "rgb(214, 64, 22)",
    "rgb(214, 22, 22",
    "rgb(156, 6, 6",
  ]
  const range = [10, 100, 500, 1000, 2000, 4000, 8000, 16000, 20000, 32000]
  useEffect(() => {
    const faux = connectFauxDOM("div", "chart")
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

    color = d3
      .scaleThreshold()
      .domain(range)
      .range(spectrum)
    path = d3.geoPath()
    svg = d3
      .select(faux)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "map")

    var projection = d3
      .geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5])

    path = d3.geoPath().projection(projection)

    // svg.call(tip)
    ready(null, worldData, data.allCovid)
  }, [])
  return (
    <>
      <Legend range={range} spectrum={spectrum}></Legend>
      <div className="worldmap-container">{chart}</div>
    </>
  )
}

export default withFauxDOM(WorldMap)
