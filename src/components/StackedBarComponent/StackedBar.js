import React, { Component } from "react";
import { Dropdown } from "../index";
import * as d3 from "d3";

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

		const data = this.props.csv_data;
		const xAxis = this.state.selected_x;
		const color = this.state.selected_color;

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

		bars.selectAll("rect")
			.data((d) => d)
			.join("rect")
			.attr("x", (d) => xScale(d.data[xAxis]))
			.attr("y", (d) => yScale(d[1]))
			.attr("height", (d) => yScale(d[0]) - yScale(d[1]))
			.attr("width", xScale.bandwidth())
			.append("title")
			.text((d) => `${d.data[xAxis]}\n${d.key}: ${d[1] - d[0]} students`);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale))
			.selectAll("text")
			.style("text-anchor", "middle");

		svg.append("g")
			.call(d3.axisLeft(yScale))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -40)
			.attr("x", -height / 2)
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.text("Total Number of Students");

		const legend = svg.append("g").attr("transform", "translate(10,10)");

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

				bars.transition()
					.duration(500)
					.attr("opacity", (series) =>
						colorFilter.has(series.key) ? 0.2 : 1
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

				bars.transition()
					.duration(500)
					.attr("opacity", (series) =>
						colorFilter.has(series.key) ? 0.2 : 1
					);
			});
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
