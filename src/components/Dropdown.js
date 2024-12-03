import React from "react";

const Dropdown = ({ options, selectedValue, onChange, label }) => {
	//console.log("Dropdown options", options);
	console.log("Dropdown mount for ", label);
	return (
		<div>
			{label && <label>{label}: </label>}
			<select value={selectedValue} onChange={onChange}>
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
