import React, { Component } from "react";
import * as d3 from "d3";

class ScatterPlotComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			set_y: "Exam_Score",
		};
	}

	componentDidMount() {
		console.log("Scatterplot selected x scale: ", this.props.x_scale);
		this.renderChart();
	}

	componentDidUpdate() {
		console.log(
			"Scatterplot selected x scale updated: ",
			this.props.x_scale
		);
		console.log("Loaded csv_data", this.props.csv_data);
		this.renderChart();
	}

	renderChart() {}
	render() {
		return (
			<div className="parent">
				<div></div>
			</div>
		);
	}
}

export default ScatterPlotComponent;
