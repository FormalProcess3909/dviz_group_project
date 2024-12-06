import React, { Component } from "react";
import * as d3 from "d3";
import { Dropdown, RangeSlider } from "./index";

class ScatterPlotComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x_axis_min: 0,
			x_axis_max: 0,
			y_axis_min: 0,
			y_axis_max: 0,
			selected_x: "Hours_Studied",
			selected_y: "Exam_Score",
			selected_color: "Gender",
			from_value: 0,
			to_value: 100,
		};
	}

	calculateScaleBounds = (data, scale, margin = 10) => {
		const [min, max] = d3.extent(data, (d) => +d[scale]);
		return { min: min - margin, max: max + margin };
	};

	handleColor = (data, scale) => {
		return Array.from(new Set(data.map((d) => d[scale])));
	};

	componentDidMount() {
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart();
	}

	handleXAxisSelect = (event) => {
		this.setState({ selected_x: event.target.value });
	};

	handleColorSelect = (event) => {
		this.setState({ selected_color: event.target.value });
	};

	handleSliderChange = (from_value, to_value) => {
		this.setState({ from_value, to_value });
		console.log("From Value:", from_value, "To Value:", to_value);
	};

	renderChart() {
		const margin = { top: 50, right: 20, left: 50, bottom: 50 };
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const data = this.props.csv_data;
		const xAxis = this.state.selected_x;
		const yAxis = this.state.selected_y;
		const color = this.state.selected_color;

		const xBounds = this.calculateScaleBounds(data, xAxis);
		const yBounds = this.calculateScaleBounds(data, yAxis);
		const uniqueValues = this.handleColor(data, color);
		const colorScale = d3
			.scaleOrdinal()
			.domain(uniqueValues)
			.range(d3.schemeTableau10);

		d3.select(".chart").selectAll("*").remove();
		const xScale = d3
			.scaleLinear()
			.domain([xBounds.min, xBounds.max])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([yBounds.min, yBounds.max])
			.range([height, 0]);

		const svg = d3
			.select(".chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const legend = svg.append("g").attr("transform", "translate(10,10)");

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale));

		svg.append("g").call(d3.axisLeft(yScale));

		svg.append("g")
			.selectAll("dot")
			.data(data)
			.join(
				(enter) =>
					enter
						.append("circle")
						.attr("cx", (d) => xScale(d[xAxis]))
						.attr("cy", (d) => yScale(d[yAxis]))
						.attr("r", 5)
						.attr("fill", (d) => colorScale(d[color]))
						.attr("opacity", 0.8),
				(update) =>
					update
						.transition()
						.duration(500)
						.attr("cx", (d) => xScale(d[xAxis]))
						.attr("cy", (d) => yScale(d[yAxis]))
						.attr("fill", (d) => colorScale(d[color])),
				(exit) => exit.transition().duration(300).attr("r", 0).remove()
			);

		legend
			.selectAll("rect")
			.data(colorScale.domain())
			.join((enter) =>
				enter
					.append("rect")
					.attr("x", 0)
					.attr("y", (d, i) => i * 20)
					.attr("width", 18)
					.attr("height", 18)
					.attr("fill", (d) => colorScale(d))
			);

		legend
			.selectAll("text")
			.data(colorScale.domain())
			.join((enter) =>
				enter
					.append("text")
					.attr("x", 24)
					.attr("y", (d, i) => i * 20 + 13)
					.text((d) => d)
					.style("font-size", "12px")
					.style("alignment-baseline", "middle")
			);
	}

	render() {
		return (
			<div className="parent">
				<fieldset className="select_container">
					<Dropdown
						options={this.props.x_axis}
						selectedValue={this.state.selected_x}
						onChange={this.handleXAxisSelect}
						label="X Scale"
					/>

					<Dropdown
						options={this.props.color}
						selectedValue={this.state.selected_color}
						onChange={this.handleColorSelect}
						label="Color"
					/>

					<RangeSlider onChange={this.handleSliderChange} />
				</fieldset>
				<div className="chart" />
			</div>
		);
	}
}

export default ScatterPlotComponent;
