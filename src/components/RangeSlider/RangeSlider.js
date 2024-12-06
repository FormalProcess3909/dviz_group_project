import React, { useEffect, useState } from "react";
import "./RangeSlider.css";

const RangeSlider = ({ onChange, min = 0, max = 100 }) => {
	const [fromValue, setFromValue] = useState(min);
	const [toValue, setToValue] = useState(max);

	const updateSliderFill = () => {
		const rangeDistance = max - min;
		const fromPercentage = ((fromValue - min) / rangeDistance) * 100;
		const toPercentage = ((toValue - min) / rangeDistance) * 100;

		//slider colors
		const sliderBackground = "#C6C6C6";
		const sliderFill = "#25DAA5";

		const sliderStyle = `linear-gradient(
        to right,
        ${sliderBackground} 0%,
        ${sliderBackground} ${fromPercentage}%,
        ${sliderFill} ${fromPercentage}%,
        ${sliderFill} ${toPercentage}%,
        ${sliderBackground} ${toPercentage}%,
        ${sliderBackground} 100%)`;

		const sliders = document.querySelectorAll(
			".double-slider input[type='range']"
		);
		sliders.forEach((slider) => {
			slider.style.background = sliderStyle;
		});
	};

	const handleFromChange = (e) => {
		const value = Math.min(Number(e.target.value), toValue);
		setFromValue(value);
		if (onChange) {
			onChange(value, toValue);
		}
	};

	const handleToChange = (e) => {
		const value = Math.max(Number(e.target.value), fromValue);
		setToValue(value);
		if (onChange) {
			onChange(fromValue, value);
		}
	};

	useEffect(() => {
		updateSliderFill();
	}, [fromValue, toValue, min, max]);

	return (
		<div className="double-slider">
			<input
				type="range"
				min={min}
				max={max}
				value={fromValue}
				className="fromSlider"
				onInput={handleFromChange}
			/>
			<input
				type="range"
				min={min}
				max={max}
				value={toValue}
				className="toSlider"
				onInput={handleToChange}
			/>
		</div>
	);
};

export default RangeSlider;
