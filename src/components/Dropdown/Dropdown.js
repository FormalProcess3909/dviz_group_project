import React from "react";
import "./Dropdown.css";
const Dropdown = ({ options, selectedValue, onChange, label }) => {
	//console.log("Dropdown options", options);
	//console.log("Dropdown mounted");
	return (
		<div>
			{label && <label>{label}: </label>}
			<select value={selectedValue} onChange={onChange}>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

export default Dropdown;
