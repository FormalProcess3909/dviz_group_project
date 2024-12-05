import React from "react";
import "./RangeSlider.css";

const RangeSlider = ({ min = 0, max = 100 }) => {
	fillSlider = ({ from, to, slider_color, range_color, control_slider }) => {
		const range_distance = to.max - to.min;
		const from_pos = from.value - to.min;
		const to_pos = to.value - to.min;

		controlSlider.style.background = `linear(
            to right,
            ${slider_color} 0%,
            ${slider_color} ${(from_pos / range_distance) * 100}%,
            ${range_color} ${(from_pos / range_distance) * 100}%,
            ${range_color} ${(to_pos / range_distance) * 100}%,
            ${slider_color} ${(to_pos / range_distance) * 100}%,
            ${slider_color} 100%)`;
	};

	setToggleAccessible = ({ current_target }) => {
		const to_slider = document.querySelector(".to_slider");
		if (Number(current_target.value) <= 0) {
			to_slider.style.zIndex = 2;
		}
		return (
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
		);
	};
};

export default RangeSlider;
