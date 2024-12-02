import React, { Component } from "react";
import "./css/App.css";
import { FileUpload } from "./components";

class App extends Component {
	render() {
		return (
			<div>
				<FileUpload set_data={this.set_data}></FileUpload>
			</div>
		);
	}
}

export default App;
