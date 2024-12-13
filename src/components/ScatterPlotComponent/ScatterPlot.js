import React, { Component } from "react";
import * as d3 from "d3";
import { Dropdown, RangeSlider } from "../index";
import "./ScatterPlot.css";
import utils from "../../utils";

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

	handleXAxisSelect = (event) => {
		this.setState({ selected_x: event.target.value });
	};

	handleColorSelect = (event) => {
		this.setState({ selected_color: event.target.value });
	};

	handleSliderChange = (from_value, to_value) => {
		this.setState({ from_value, to_value });
	};

	renderChart() {
		d3.select(".scatter-plot").selectAll("*").remove();

		const margin = { top: 50, right: 20, left: 50, bottom: 50 };
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const data = this.props.csv_data;
		const xAxis = this.state.selected_x;
		const yAxis = this.state.selected_y;
		const color = this.state.selected_color;

		const xBounds = utils.calculateScaleBounds(data, xAxis, 3);
		const yBounds = utils.calculateScaleBounds(data, yAxis, 3);
		const uniqueValues = utils.handleColor(data, color);
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

		const svg = d3
			.select(".scatter-plot")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip");

		const mouseOver = function (event, d) {
			tooltip.style("opacity", 1);
		};

		const mouseMove = function (event, d) {
			const circle = d3.select(this);
			const radius = parseFloat(circle.attr("r"));
			tooltip
				.html(
					`${xAxis.replace(/_/g, " ")}: ${d[xAxis]}<br>` +
						`${yAxis.replace(/_/g, " ")}: ${d[yAxis]}<br>` +
						`${color.replace(/_/g, " ")}: ${d[color]}<br>`
				)
				.style("left", event.pageX + radius + "px")
				.style("top", event.pageY - radius + "px");
		};

		const mouseLeave = function (event, d) {
			tooltip.style("opacity", 0);
		};

		const legend = svg
			.append("g")
			.attr("transform", "translate(10,10)")
			.data(colorScale.domain());

		const legendItems = legend
			.selectAll("g")
			.data(colorScale.domain())
			.join("g")
			.attr("transform", (d, i) => `translate(0,${i * 20})`)
			.style("cursor", "pointer")
			.on("click", (event, d) => {
				if (colorFilter.size === 1 && colorFilter.has(d)) {
					colorFilter = new Set(uniqueValues);
				} else {
					colorFilter.clear();
					colorFilter.add(d);
				}
				svg.selectAll("circle")
					.transition()
					.duration(300)
					.attr("opacity", (dataPoint) =>
						colorFilter.has(dataPoint[color]) ? 1 : 0
					);
			});

		legendItems
			.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.attr("fill", (d) => colorScale(d));

		legendItems
			.append("text")
			.attr("x", 24)
			.attr("y", 13)
			.text((d) => d)
			.style("font-size", "12px")
			.style("alignment-baseline", "middle");

		const xScale = d3
			.scaleLinear()
			.domain([xBounds.min, xBounds.max])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([yBounds.min, yBounds.max])
			.range([height, 0]);

		const binWidth = 10;
		let densityMap = new Map();

		sliderFilter.forEach((d) => {
			const binKey = `${Math.floor(
				xScale(d[xAxis]) / binWidth
			)},${Math.floor(yScale(d[yAxis]) / binWidth)}`;
			densityMap.set(binKey, (densityMap.get(binKey) || 0) + 1);
		});

		const maxDensity = Math.max(...densityMap.values());

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale))
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", width / 2)
			.attr("y", margin.bottom - 10)
			.attr("fill", "black")
			.text(xAxis.replace(/_/g, " "));

		svg.append("g")
			.call(d3.axisLeft(yScale))
			.append("text")
			.attr("text-anchor", "middle")
			.attr(
				"transform",
				`translate(${-margin.left + 20},${height / 2}) rotate(-90)`
			)
			.attr("fill", "black")
			.text(yAxis.replace(/_/g, " "));

		svg.append("g")
			.selectAll("circle")
			.data(sliderFilter)
			.join(
				(enter) =>
					enter
						.append("circle")
						.attr("cx", (d) => xScale(d[xAxis]))
						.attr("cy", (d) => yScale(d[yAxis]))
						.attr("r", (d) => {
							const binKey = `${Math.floor(
								xScale(d[xAxis]) / binWidth
							)},${Math.floor(yScale(d[yAxis]) / binWidth)}`;
							const density = densityMap.get(binKey);
							return 3 + Math.sqrt(density / maxDensity) * 5;
						})
						.attr("fill", (d) => colorScale(d[color]))
						.attr("opacity", 1),
				(update) =>
					update
						.transition()
						.duration(500)
						.attr("cx", (d) => xScale(d[xAxis]))
						.attr("cy", (d) => yScale(d[yAxis]))
						.attr("fill", (d) => colorScale(d[color])),
				(exit) => exit.transition().duration(300).attr("r", 0).remove()
			)
			.on("mouseover", mouseOver)
			.on("mousemove", mouseMove)
			.on("mouseleave", mouseLeave);
	}

	render() {
		const yBound = utils.calculateScaleBounds(
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
				<div className="chart scatter-plot" />
			</div>
		);
	}
}

export default ScatterPlot;
