import React, { Component } from "react";
import * as d3 from "d3";

class ScatterPlotComponent extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//console.log("Scatterplot selected x scale: ", this.props.x_scale);
		this.renderChart();
	}

	componentDidUpdate() {
		//	console.log(
		//		"Scatterplot selected x scale updated: ",
		//		this.props.x_scale
		//	);
		//console.log("Loaded csv_data", this.props.csv_data);
		this.renderChart();
	}

	renderChart() {
		const margin = { top: 50, right: 20, left: 50, bottom: 50 };
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const data = this.props.csv_data;
		const select_x = this.props.x_scale;
		const color = this.props.color;

		console.log("Rendering CSV data: ", data);

		d3.select(".chart").selectAll("*").remove();

		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(data, (d) => +d[select_x]))
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain(d3.extent(data, (d) => +d["Exam_Score"]))
			.range([height, 0]);

		const svg = d3
			.select(".chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale));

		svg.append("g").call(d3.axisLeft(yScale));

		//var color = d3.scaleOrdinal();

		svg.append("g")
			.selectAll("dot")
			.data(data)
			.join(
				(enter) =>
					enter
						.append("circle")
						.attr("cx", (d) => xScale(d[select_x]))
						.attr("cy", (d) => yScale(d["Exam_Score"]))
						.attr("r", 5)
						.attr("fill", (d) => d3.color(d[color])),
				(update) => update,
				(exit) => exit.remove()
			);
	}
	render() {
		return (
			<div className="parent">
				<div className="chart"></div>
			</div>
		);
	}
}

export default ScatterPlotComponent;
