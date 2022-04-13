import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";

import bangkokData from "./bangkok";

const transitionDuration = 400;
const h = Math.sqrt(3) / 2;
const r = 30;

function buildHexPath(x = 0, y = 0) {
  return d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveCardinalClosed.tension("0.8"))([
    { x: r + x, y },
    { x: r / 2 + x, y: r * h + y },
    { x: -r / 2 + x, y: r * h + y },
    { x: -r + x, y },
    { x: -r / 2 + x, y: -r * h + y },
    { x: r / 2 + x, y: -r * h + y },
  ]);
}
const hexPath = buildHexPath();

function hexFill(team) {
  switch (team.team) {
    case "a":
      return "rgb(255, 1, 175)";
    case "b":
      return "rgb(60, 60, 60)";
    default:
      return "rgb(60, 60, 60)";
  }
}

const Hexagon = () => {
  const [hexData, setHexData] = useState(bangkokData);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const svg = useRef();

  useEffect(() => {
    const hexGroup = d3.select(svg.current).append("g")
    hexGroup
      .selectAll(".hex")
      .data(hexData)
      .enter()
      .append("svg:a")
      .attr("class", "hex")
      .attr("href", "")
      .attr("data-tip", "hello world")
      .on("click", (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('e', event.target);
        // setHexData(hexData.map(hex => toggleHex(d, hex)));
      })
      .on("mouseenter", (event, d, a) => {
        event.preventDefault();
        event.stopPropagation();
        const node = event.target;
        const parentNode = node.parentNode.parentNode;
        
        const parentPos = parentNode.getBoundingClientRect();
        const childPos = node.getBoundingClientRect();
        const relativePos = {};
        // console.log('parent', parentPos);
        console.log('child', childPos);
        relativePos.y = (childPos.top - parentPos.top - 20);
        relativePos.x = (childPos.left - parentPos.left + (childPos.width / 2));
        console.log('wowwoww', relativePos);
        setTargetPosition(relativePos);
        setTooltipVisible(true);
      })
      .on("mouseleave", (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        setTooltipVisible(false);
      })
      .append("path")
      .attr("d", hexPath)
      .attr("fill", hexFill)
      .attr("stroke", "transparent")
      .attr("stroke-width", 4)
      .text(function (d) {
        return d.row + d.col;
      })
      .attr("transform", (d) => {
        const cx = d.col * r * 2 + (d.row % 2 ? r * 2 : r);
        const cy = d.row * r * 1.75 + r;
        return `translate(${cx}, ${cy}) rotate(90 0 0)`;
      });

    const textGroup = d3.select(svg.current).append("g")
    textGroup
      .selectAll(".hex")
      .data(hexData)
      .enter()
      .append("svg:a")
      .attr("class", "hex")
      // .attr('href', '')
      .on("click", (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        // setHexData(hexData.map(hex => toggleHex(d, hex)));
      })
      .on("mouseenter", (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        // setTargetPosition({x: event.offsetX, y: event.offsetY});
        setTooltipVisible(true);
      })
      .on("mouseleave", (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        // setTooltipVisible(false)
      })
      .append("text")
      .text(function (d) {
        return d.row + d.col;
      })
      .style("font-size", 16)
      .style("font-weight", 600)
      .style("fill", "white")
      .attr("transform", (d) => {
        const cx = d.col * r * 2 + (d.row % 2 ? r * 2 : r) - 8;
        const cy = d.row * r * 1.75 + r + 6;
        return `translate(${cx}, ${cy})`;
      });
    // .append("text")
    // .selectAll("labels")
    // .data(data.features)
    // .attr("dx", function(d){return -20})
    // .attr("y", function(d){return 0})
    // .text(function(d){ return d.row+d.col})
    // .attr("text-anchor", "middle")
    // .attr("alignment-baseline", "central")
    // .style("font-size", 11)
    // .style("fill", "white")
    // hexGroup.select

    const svgBox = svg.current.getBoundingClientRect();
    const hexBox = hexGroup.node().getBBox();
    const scale = svgBox.height / hexBox.height;
    const centerX = svgBox.width / 2 - (hexBox.width * scale) / 2;
    hexGroup
      .attr("transform", `matrix(0, 0, 0, 0, ${centerX}, 0)`)
      .transition()
      .duration(transitionDuration)
      .attr("transform", `matrix(${scale}, 0, 0, ${scale}, ${centerX}, 0)`);
    textGroup
      .attr("transform", `matrix(0, 0, 0, 0, ${centerX}, 0)`)
      .transition()
      .duration(transitionDuration)
      .attr("transform", `matrix(${scale}, 0, 0, ${scale}, ${centerX}, 0)`);
  }, [hexData]);

  // componentDidUpdate() {
  //   this.hexGroup
  //     .selectAll('.hex')
  //     .data(this.state.hexData)
  //     .select('path')
  //       .transition()
  //       .duration(transitionDuration)
  //       .attr('fill', hexFill);
  // }
  useEffect(() => {});

  const hexStyle = { flex: 1};
  return (
    <ContainerA><ContainerB>
    <HexagonContainer>
      {tooltipVisible && (
        <CustomToolTip x={targetPosition.x} y={targetPosition.y}>
          <div>Hello</div>
          <div>l</div>
          <div>Hello</div>
        </CustomToolTip>
      )}
      <svg ref={svg} style={hexStyle}/>
    </HexagonContainer>
    </ContainerB></ContainerA>
  );
};

export default Hexagon;

const HexagonContainer = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  position: relative;
`;

const CustomToolTip = styled.div`
  position: absolute;
  background: red;
  display: flex;
  width: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: ${(props) => `${props.y}px`};
  left: ${(props) => `${props.x}px`};
  z-index: 5;
  transform: translate(-50%, 0);
`;

const ContainerA = styled.div`
  background-color: red;
  width: 100%;
  padding-top: 50%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of it */
`

const ContainerB = styled.div`
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
`
