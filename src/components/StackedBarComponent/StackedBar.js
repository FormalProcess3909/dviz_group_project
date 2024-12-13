import React, { Component } from "react";
import { Dropdown } from "../index";
import * as d3 from "d3";
import utils from "../../utils";
class StackedBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_x: "Gender",
			selected_color: "Parental_Involvement",
		};
	}

	componentDidMount() {
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart();
	}

	handleColorSelect = (event) => {
		this.setState({ selected_color: event.target.value });
	};

	handleXAxisSelect = (event) => {
		this.setState({ selected_x: event.target.value });
	};

	renderChart() {
		d3.select(".stacked-bar").selectAll("*").remove();

		const margin = { top: 50, right: 20, left: 50, bottom: 50 };
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const xAxis = this.state.selected_x;
		const color = this.state.selected_color;
		const data = this.props.csv_data.filter(
			(d) => d[color] !== "" && d[color] != null
		);
		const xValues = [...new Set(data.map((d) => d[xAxis]))].sort();
		const colorValues = [...new Set(data.map((d) => d[color]))].sort();

		let colorFilter = new Set(colorValues);

		const stackedData = xValues.map((xVal) => {
			const filtered = data.filter((d) => d[xAxis] === xVal);
			const counts = {};
			colorValues.forEach((cVal) => {
				counts[cVal] = filtered.filter((d) => d[color] === cVal).length;
			});
			return {
				[xAxis]: xVal,
				...counts,
			};
		});

		const stack = d3.stack().keys(colorValues);

		const series = stack(stackedData);

		const xScale = d3
			.scaleBand()
			.domain(xValues)
			.range([0, width])
			.padding(0.3);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
			.range([height, 0])
			.nice();

		const colorScale = d3
			.scaleOrdinal()
			.domain(colorValues)
			.range(d3.schemeTableau10);

		const svg = d3
			.select(".stacked-bar")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const bars = svg
			.selectAll("g.series")
			.data(series)
			.join("g")
			.attr("class", "series")
			.attr("fill", (d) => colorScale(d.key));

		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip");

		const mouseOver = function (event, d) {
			tooltip.style("opacity", 1);
		};

		const mouseMove = function (event, d) {
			tooltip.selectAll("*").remove();
			const key = Object.keys(d.data).find(
				(k) => d.data[k] === d[1] - d[0] && k !== xAxis
			);
			const groupStudents = data.filter(
				(student) =>
					student[color] === key && student[xAxis] === d.data[xAxis]
			);
			const examScores = groupStudents.map(
				(student) => +student["Exam_Score"]
			);

			const xMiniBounds = utils.calculateScaleBounds(
				groupStudents,
				"Exam_Score",
				5
			);

			const bins = d3
				.bin()
				.domain([xMiniBounds.min, xMiniBounds.max])
				.thresholds(d3.range(0, 100, 5))(examScores);

			const miniMargin = { top: 20, right: 20, bottom: 30, left: 50 };
			const tooltipWidth = 300;
			const tooltipHeight = 200;

			const tooltipSvg = tooltip
				.style("opacity", 1)
				.style("left", event.pageX + 10 + "px")
				.style("top", event.pageY - 200 + "px")
				.append("svg")
				.attr("width", tooltipWidth)
				.attr("height", tooltipHeight)
				.append("g")
				.attr(
					"transform",
					`translate(${miniMargin.left},${miniMargin.top})`
				);

			const miniX = d3
				.scaleLinear()
				.domain([xMiniBounds.min, xMiniBounds.max])
				.range([0, tooltipWidth - miniMargin.left - miniMargin.right])
				.nice();

			const miniY = d3
				.scaleLinear()
				.domain([0, d3.max(bins, (d) => d.length)])
				.range([tooltipHeight - miniMargin.top - miniMargin.bottom, 0])
				.nice();

			tooltipSvg
				.selectAll("rect")
				.data(bins)
				.join("rect")
				.attr("x", (d) => miniX(d.x0))
				.attr("y", (d) => miniY(d.length))
				.attr("width", (d) =>
					Math.max(0, miniX(d.x1) - miniX(d.x0) - 1)
				)
				.attr(
					"height",
					(d) =>
						tooltipHeight -
						miniMargin.top -
						miniMargin.bottom -
						miniY(d.length)
				)
				.attr("fill", colorScale(key));

			const miniXAxis = d3.axisBottom(miniX).ticks(10);

			const miniYAxis = d3.axisLeft(miniY).ticks(5);

			tooltipSvg
				.append("g")
				.attr(
					"transform",
					`translate(0,${
						tooltipHeight - miniMargin.top - miniMargin.bottom
					})`
				)
				.call(miniXAxis)
				.append("text")
				.attr(
					"x",
					tooltipWidth - miniMargin.left - miniMargin.right - 10
				)
				.attr("y", 25)
				.attr("fill", "black")
				.style("text-anchor", "end")
				.text("Exam Score");

			tooltipSvg
				.append("g")
				.call(miniYAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("x", -10)
				.attr("y", -30)
				.attr("fill", "black")
				.style("text-anchor", "end")
				.text("Number of Students");
		};
		const mouseLeave = function (event, d) {
			tooltip.style("opacity", 0);
		};

		const legend = svg.append("g").attr("transform", "translate(10,10)");

		const legendItems = legend
			.selectAll("g")
			.data(colorScale.domain())
			.join("g")
			.attr("transform", (d, i) => `translate(0,${i * 20})`)
			.style("cursor", "pointer")
			.on("click", (event, d) => {
				if (colorFilter.size === 1 && colorFilter.has(d)) {
					colorFilter = new Set(colorValues);
				} else {
					colorFilter.clear();
					colorFilter.add(d);
				}
				bars.transition()
					.duration(500)
					.attr("opacity", (series) =>
						colorFilter.has(series.key) ? 1 : 0.2
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

		bars.selectAll("rect")
			.data((d) => d)
			.join("rect")
			.attr("x", (d) => xScale(d.data[xAxis]))
			.attr("y", (d) => yScale(d[1]))
			.attr("height", (d) => yScale(d[0]) - yScale(d[1]))
			.attr("width", xScale.bandwidth())
			.on("mouseover", mouseOver)
			.on("mousemove", mouseMove)
			.on("mouseleave", mouseLeave);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale))
			.selectAll("text")
			.style("text-anchor", "middle");

		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + 40)
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.style("font-size", "14px")
			.text(xAxis.replace(/_/g, " "));

		svg.append("g")
			.call(d3.axisLeft(yScale))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -40)
			.attr("x", -height / 2)
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.text("Total Number of Students");
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
				</fieldset>
				<div className="chart stacked-bar" />
			</div>
		);
	}
}

export default StackedBar;
