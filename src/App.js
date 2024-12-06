import React, { Component } from "react";

import "./App.css";
import { FileUpload, StackedBar, ScatterPlot } from "./components";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			//numerical columns
			quant_cols: [
				"Hours_Studied",
				"Attendance",
				"Sleep_Hours",
				"Tutoring_Sessions",
				"Exam_Score",
				"Physical_Activity",
				"Previous_Scores",
			],
			//categorical columns containing 2 or less choices
			binary_cols: [
				"Extracurricular_Activities",
				"Gender",
				"Learning_Disabilities",
				"Internet_Access",
				"School_Type",
			],
			//categorical columns containing 3 or more choices
			cat_cols: [
				"Parental_Involvement",
				"Access_to_Resources",
				"Motivation_Level",
				"Family_Income",
				"Teacher_Quality",
				"Peer_Influence",
				"Parental_Education_Level",
				"Distance_from_Home",
			],
		};
	}

	setData = (csv_data) => {
		this.setState({
			data: csv_data,
		});
	};

	handleChartTwoXAxis = (event) => {
		this.setState({ chart2_x_axis: event.target.value });
	};

	handleChartTwoColor = (event) => {
		this.setState({ chart2_color: event.target.value });
	};

	render() {
		return (
			<div className="container">
				<FileUpload set_data={this.setData} />
				<div className="chart-container">
					<div className="chart1">
						<ScatterPlot
							csv_data={this.state.data}
							x_axis={this.state.quant_cols}
							color={this.state.binary_cols}
						/>
					</div>
					<div className="chart2">
						<StackedBar
							csv_data={this.state.data}
							x_axis={this.state.chart1_x_axis}
							color={this.state.chart2_color}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
