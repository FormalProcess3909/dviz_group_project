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
			columns: [
				"Hours_Studied",
				"Attendance",
				"Parental_Involvement",
				"Access_to_Resources",
				"Extracurricular_Activities",
				"Sleep_Hours",
				"Previous_Scores",
				"Motivation_Level",
				"Internet_Access",
				"Tutoring_Sessions",
				"Family_Income",
				"Teacher_Quality",
				"School_Type",
				"Peer_Influence",
				"Physical_Activity",
				"Learning_Disabilities",
				"Parental_Education_Level",
				"Distance_from_Home",
				"Gender",
				"Exam_Score",
			],
			selected_x_1: "Gender",
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

	handleDropdownChangeTwo = (event) => {};

	render() {
		return (
			<div>
				<FileUpload set_data={this.setData} />
				<div className="container dropdown">
					{this.state.columns.length > 0 && (
						<Dropdown
							options={this.state.columns}
							selectedValue={"Gender"}
							onChange={this.handleDropdownChangeOne}
							label="X Scale"
						/>
					)}
					{this.state.columns.length > 0 && (
						<Dropdown
							options={this.state.columns}
							selectedValue={"Gender"}
							onChange={this.handleDropdownChangeOne}
							label="X Scale"
						/>
					)}
				</div>
				<ScatterPlotComponent
					csv_data={this.state.data}
					x_scale={this.state.selected_x_1}
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
