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
		this.renderChart();
	}

	componentDidUpdate() {
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
