import React, { Component } from "react";

import "./App.css";
import {
	FileUpload,
	StackedBarComponent,
	ScatterPlotComponent,
	Dropdown,
} from "./components";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			quantitative_col: [
				"Hours_Studied",
				"Attendance",
				"Sleep_Hours",
				"Tutoring_Sessions",
				"Exam_Score",
				"Physical_Activity",
				"Previous_Scores",
			],
			binary_col: [
				"Extracurricular_Activities",
				"Gender",
				"Learning_Disabilities",
				"Internet_Access",
				"School_Type",
			],
			categorical_col: [
				"Parental_Involvement",
				"Access_to_Resources",
				"Motivation_Level",
				"Family_Income",
				"Teacher_Quality",
				"Peer_Influence",
				"Parental_Education_Level",
				"Distance_from_Home",
			],
			chart1_x_axis: "Hours_Studied",
			chart1_y_axis: "Exam_Score",
			chart1_color: "Gender",
			chart2_x_axis: "Gender",
			chart2_color: "Distance_from_Home",
			chart1_min: 0,
			chart1_max: 100,
		};
	}

	setData = (csv_data) => {
		this.setState({
			data: csv_data,
		});
	};

	handleChartOneXAxis = (event) => {
		this.setState({ chart1_x_axis: event.target.value });
	};

	handleChartOneColor = (event) => {
		this.setState({ chart1_color: event.target.value });
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
				<div className="chart1">
					<div className="select_container">
						<Dropdown
							options={this.state.quantitative_col}
							selectedValue={this.state.selected_x_1}
							onChange={this.handleChartOneXAxis}
							label="X Scale"
						/>

						<Dropdown
							options={this.state.binary_col}
							selectedValue={this.state.chart1_color_select}
							onChange={this.handleChartOneColor}
							label="Color"
						/>

						<div className="double_slider">
							<input
								type="range"
								min={this.state.chart1_min}
								max={this.state.chart1_max}
								className="from_slider"
							/>
							<input
								type="range"
								min={this.state.chart1_min}
								max={this.state.chart1_max}
								className="to_slider"
							/>
						</div>
					</div>
					<ScatterPlotComponent
						csv_data={this.state.data}
						x_scale={this.state.chart1_x_axis}
						y_scale={this.state.chart1_y_axis}
						color={this.state.chart1_color_select}
					/>
				</div>
				<div className="chart2">
					<div className="select_container">
						<Dropdown
							options={this.state.binary_col}
							selectedValue={this.state.chart2_x_axis}
							onChange={this.handleChartTwoXAxis}
							label="X Scale"
						/>

						<Dropdown
							options={this.state.categorical_col}
							selectedValue={this.state.chart2_color}
							onChange={this.handleChartTwoColor}
							label="Color"
						/>
					</div>
					<StackedBarComponent
						csv_data={this.state.data}
						x_scale={this.state.chart1_x_axis}
						color={this.state.chart2_color}
					/>
				</div>
			</div>
		);
	}
}

export default App;
