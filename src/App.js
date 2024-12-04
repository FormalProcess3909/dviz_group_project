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
			selected_x_1: "Hours_Studied",
			selected_color_1: "Gender",
			selected_x_2: "Extracurricular_Activities",
		};
	}

	setData = (csv_data) => {
		this.setState({ data: csv_data });
	};

	handleDropdownChangeOne = (event) => {
		this.setState({ selected_x_1: event.target.value });
		//	console.log(
		//		"Changed xscale from ",
		//		this.state.selected_x_1,
		//		" to ",
		//		event.target.value
		//	);
	};

	handleColorChangeOne = (event) => {
		this.setState({ selected_color_1: event.target.value });
	};
	handleDropdownChangeTwo = (event) => {};

	render() {
		return (
			<div className="container">
				<FileUpload set_data={this.setData} />
				<div className="dropdown">
					<Dropdown
						options={this.state.quantitative_col}
						selectedValue={this.state.selected_x_1}
						onChange={this.handleDropdownChangeOne}
						label="X Scale"
					/>

					<Dropdown
						options={this.state.binary_col}
						selectedValue={this.state.selected_color_1}
						onChange={this.handleColorChangeOne}
						label="Color"
					/>
				</div>
				<ScatterPlotComponent
					csv_data={this.state.data}
					x_scale={this.state.selected_x_1}
					color={this.state.selected_color_1}
				/>
				<StackedBarComponent
					csv_data={this.state.data}
					x_scale={this.state.selected_x_2}
				/>
			</div>
		);
	}
}

export default App;
