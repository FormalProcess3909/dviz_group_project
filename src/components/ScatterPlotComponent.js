import React, { Component } from "react";
import * as d3 from "d3";

class ScatterPlotComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x_axis_min: 0,
			x_axis_max: 0,
			y_axis_min: 0,
			y_axis_max: 0,
		};
	}

	calculateScaleBounds = (data, scale, margin = 10) => {
		const [min, max] = d3.extent(data, (d) => +d[scale]);
		return { min: min - margin, max: max + margin };
	};

	componentDidMount() {
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart();
	}

	renderChart() {
		const margin = { top: 50, right: 20, left: 50, bottom: 50 };
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const data = this.props.csv_data;
		const x_axis = this.props.x_scale;
		const y_axis = this.props.y_scale;
		const color = this.props.color;

		const x_bounds = this.calculateScaleBounds(data, x_axis);
		const y_bounds = this.calculateScaleBounds(data, y_axis);

		d3.select(".chart").selectAll("*").remove();

		const xScale = d3
			.scaleLinear()
			.domain([x_bounds.min, x_bounds.max])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([y_bounds.min, y_bounds.max])
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
						.attr("cx", (d) => xScale(d[x_axis]))
						.attr("cy", (d) => yScale(d[y_axis]))
						.attr("r", 5)
						.attr("fill", (d) => d3.color(d[color])),
				(update) => update,
				(exit) => exit.remove()
			);
	}
	render() {
		return (
			<div className="parent">
				<div className="chart" />
			</div>
		);
	}
}

export default ScatterPlotComponent;
