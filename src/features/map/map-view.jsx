import React from 'react';
import PropTypes from 'prop-types';
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';

const MapView = ({
	center,
	onCenterChange,
	geometry,
	onClick,
	selectedCountry,
	zoom
}) => {
	return (
		<Motion
			defaultStyle={{
				zoom: 1,
				x: 0,
				y: 0,
			}}
			style={{
				zoom: spring(zoom, {stiffness: 210, damping: 20}),
				x: spring(center[0], {stiffness: 210, damping: 20}),
				y: spring(center[1], {stiffness: 210, damping: 20}),
				/*
				zoom,
				x: center[0],
				y: center[1]
				*/
			}}
		>
			{({zoom: motionZoom, x, y}) => {
				return (
					<ComposableMap
						style={{width: "100%", height: "70vh"}}
					>
						<ZoomableGroup
							center={[x, y]}
							zoom={motionZoom}
							onMoveEnd={onCenterChange}
							onMoveStart={onCenterChange}
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
				)}}
			</Motion>
	)};

MapView.propTypes = {
	center: PropTypes.array.isRequired,
	zoom: PropTypes.number.isRequired
}
export default MapView;
