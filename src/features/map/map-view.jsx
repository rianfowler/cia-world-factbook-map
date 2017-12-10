import React from 'react'
import PropTypes from 'prop-types'
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps'

const path = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapView = ({
	center,
	zoom
}) => (
	<ComposableMap
		style={{width: "100%", height: "40vh"}}
	>
		<ZoomableGroup
			center={center}
			zoom={zoom}
		>
			<Geographies geography={path}>
				{(geographies, projection) => geographies.map(geography => (
					<Geography
						key={ geography.id }
						geography={ geography }
						projection={ projection }
						style={{
							default: {
								fill: "#ECEFF1",
								stroke: "#607D8B",
								strokeWidth: 0.5,
								outline: "none"
							}
						}}
					/>
				))}
			</Geographies>
		</ZoomableGroup>
	</ComposableMap>
);

MapView.propTypes = {
	center: PropTypes.array.isRequired,
	zoom: PropTypes.number.isRequired
}
export default MapView;
