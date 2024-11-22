import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload";


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