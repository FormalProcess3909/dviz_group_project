import React from "react";

const Dropdown = ({ options, selectedValue, onChange, label }) => {
	console.log("Dropdown options", options);
	return (
		<div>
			<label>{label}</label>
			<select value={selectedValue} onChange={onChange}>
				<option></option>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

export default Dropdown;
