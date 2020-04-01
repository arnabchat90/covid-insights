import React from "react"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { useStaticQuery, graphql } from "gatsby"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    font: 11,
  },
  body: {
    fontSize: 11,
  },
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow)

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export default function CustomizedTables() {
  const classes = useStyles()
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
  const rows = data.allCovid.group

  rows.sort((a, b) => {
    return a.nodes[0].cases > b.nodes[0].cases ? -1 : 1
  })

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Country</StyledTableCell>
            <StyledTableCell align="right">Total Cases</StyledTableCell>
            <StyledTableCell align="right">Date Reported</StyledTableCell>
            <StyledTableCell align="right">Cases Added Today</StyledTableCell>
            <StyledTableCell align="right">% Change in Cases</StyledTableCell>
            <StyledTableCell align="right">Deaths</StyledTableCell>
            <StyledTableCell align="right">% Change in Deaths</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map(row => {
              let changeInNewCases =
                (parseFloat(row.nodes[0]?.cases) -
                  parseFloat(row.nodes[1]?.cases)) /
                parseFloat(row.nodes[1]?.cases)
              const reducer = (accumulator, currentValue) =>
                accumulator + currentValue.cases
              const totalCasesReported = row.nodes.reduce(reducer, 0)
              changeInNewCases =
                changeInNewCases == NaN ? "-" : changeInNewCases
              changeInNewCases = (changeInNewCases * 100).toFixed(2)

              let changeInDeaths =
                (parseFloat(row.nodes[0]?.deaths) -
                  parseFloat(row.nodes[1]?.deaths)) /
                parseFloat(row.nodes[1]?.deaths)

              changeInDeaths = changeInDeaths == NaN ? "-" : changeInDeaths
              changeInDeaths = (changeInDeaths * 100).toFixed(2)

              return (
                <StyledTableRow key={row.fieldValue}>
                  <StyledTableCell component="th" scope="row">
                    {row.nodes[0]?.countriesAndTerritories}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {totalCasesReported}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.nodes[0]?.dateRep}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.nodes[0]?.cases}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {changeInNewCases}{" "}
                    {changeInNewCases > 0 ? (
                      <ArrowUpwardIcon style={{ fill: "red" }} />
                    ) : (
                      <ArrowDownwardIcon
                        style={{ fill: "green" }}
                      ></ArrowDownwardIcon>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.nodes[0]?.deaths}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {changeInDeaths}
                    {changeInDeaths > 0 ? (
                      <ArrowUpwardIcon style={{ fill: "red" }} />
                    ) : (
                      <ArrowDownwardIcon
                        style={{ fill: "green" }}
                      ></ArrowDownwardIcon>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              )
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
