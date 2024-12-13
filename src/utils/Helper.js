import * as d3 from "d3";

export const calculateScaleBounds = (data, scale, margin = 10) => {
	const [min, max] = d3.extent(data, (d) => +d[scale]);
	return { min: min - margin, max: max + margin };
};

export const handleColor = (data, scale) => {
	return Array.from(new Set(data.map((d) => d[scale])));
};
