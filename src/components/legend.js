import React from "react"
import { rgb } from "d3"

export default function Legend({ range, spectrum }) {
  return (
    <>
      <div
        style={{
          display: "inline-block",
          float: "right",
          border: "solid",
          borderColor: "lightgrey",
          borderRadius: "5px",
          margin: "5px",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        {range.map((item, index) => {
          return (
            <div
              style={{
                display: "inline-block",
              }}
            >
              <div
                style={{
                  padding: "4px",
                  width: "5px",
                  height: "5px",
                  backgroundColor: spectrum[index],
                  display: "inline-block",
                }}
              ></div>
              <div
                style={{
                  display: "inline-block",
                  margin: "5px",
                  fontSize: 9,
                }}
              >
                {" < " + item}
              </div>
            </div>
          )
        })}
        <div
          style={{
            display: "inline-block",
          }}
        >
          <div
            style={{
              padding: "4px",
              width: "5px",
              height: "5px",
              backgroundColor: rgb(0, 0, 0),
              display: "inline-block",
            }}
          ></div>
          <div
            style={{
              display: "inline-block",
              margin: "5px",
              fontSize: 9,
            }}
          >
            No Data Available
          </div>
        </div>
      </div>
    </>
  )
}
