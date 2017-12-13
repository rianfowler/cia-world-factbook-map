import React from 'react';
import PropTypes from 'prop-types';
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps';

const MapView = ({
	center,
	geometry,
	onClick,
	selectedCountry,
	zoom
}) => (
	<ComposableMap
		style={{width: "100%", height: "40vh"}}
	>
		<ZoomableGroup
			center={center}
			zoom={zoom}
		>
			<Geographies disableOptimization geography={geometry}>
				{(geographies, projection) => geographies.map(geography => {
					return <Geography
						key={ geography.properties.NAME_LONG }
						cacheId={ geography.properties.NAME_LONG}
						geography={ geography }
						projection={ projection }
						onClick={(geography) => onClick(geography.properties.NAME_LONG)}
						style={{
							default: {
								fill: geography.properties.NAME_LONG === selectedCountry ? "#FF9900" : "#ECEFF1",
								stroke: "#607D8B",
								strokeWidth: 1,
								outline: "none"
							},
							hover: {
								fill: geography.properties.NAME_LONG === selectedCountry ? "#FF9900" : "#ECEFF1",
								stroke: "#607D8B",
								strokeWidth: 1,
								outline: "none"
							},
							pressed: {
								fill: "#ECEFF1",
								stroke: "#607D8B",
								strokeWidth: 1,
								outline: "none",
							}
						}}
					/>
				})}
			</Geographies>
		</ZoomableGroup>
	</ComposableMap>
);

MapView.propTypes = {
	center: PropTypes.array.isRequired,
	zoom: PropTypes.number.isRequired
}
export default MapView;
