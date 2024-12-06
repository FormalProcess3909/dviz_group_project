import React, { Component } from "react";
import * as d3 from "d3";
import { Dropdown, RangeSlider } from "../index";
import "./ScatterPlot.css";

class ScatterPlot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_x: "Hours_Studied",
			selected_y: "Exam_Score",
			selected_color: "Gender",
			from_value: 0,
			to_value: 100,
		};
	}

	componentDidMount() {
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart();
	}

	calculateScaleBounds = (data, scale, margin = 10) => {
		const [min, max] = d3.extent(data, (d) => +d[scale]);
		return { min: min - margin, max: max + margin };
	};

	handleColor = (data, scale) => {
		return Array.from(new Set(data.map((d) => d[scale])));
	};

	handleXAxisSelect = (event) => {
		this.setState({ selected_x: event.target.value });
	};

	handleColorSelect = (event) => {
		this.setState({ selected_color: event.target.value });
	};

	handleSliderChange = (from_value, to_value) => {
		this.setState({ from_value, to_value });
		//console.log("From Value:", from_value, "To Value:", to_value);
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

		let colorFilter = new Set(uniqueValues);
		let sliderFilter = data.filter(
			(d) =>
				+d[yAxis] >= this.state.from_value &&
				+d[yAxis] <= this.state.to_value
		);

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
			.selectAll("circle")
			.data(sliderFilter)
			.join(
				(enter) =>
					enter
						.append("circle")
						.attr("cx", (d) => xScale(d[xAxis]))
						.attr("cy", (d) => yScale(d[yAxis]))
						.attr("r", 5)
						.attr("fill", (d) => colorScale(d[color]))
						.attr("opacity", 0.6),
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
			)
			.on("click", (event, d) => {
				if (colorFilter.has(d)) {
					colorFilter.delete(d);
				} else {
					colorFilter.add(d);
				}

				svg.selectAll("circle")
					.transition()
					.duration(300)
					.attr("opacity", (dataPoint) =>
						colorFilter.has(dataPoint[color]) ? 0.6 : 0.0
					);
			});

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
			)
			.on("click", (event, d) => {
				if (colorFilter.has(d)) {
					colorFilter.delete(d);
				} else {
					colorFilter.add(d);
				}

				svg.selectAll("circle")
					.transition()
					.duration(300)
					.attr("opacity", (dataPoint) =>
						colorFilter.has(dataPoint[color]) ? 0.6 : 0.0
					);
			});
	}

	render() {
		const yBound = this.calculateScaleBounds(
			this.props.csv_data,
			this.state.selected_y
		);
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

					<RangeSlider
						onChange={this.handleSliderChange}
						min={isNaN(yBound.min) ? 0 : yBound.min}
						max={isNaN(yBound.max) ? 100 : yBound.max}
					/>
				</fieldset>
				<div className="chart" />
			</div>
		);
	}
}

export default ScatterPlot;
