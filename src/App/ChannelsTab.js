import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import DialogCreateChannel from './DialogCreateChannel.js';
const styles = require('./Style.js').styles

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		display: "flex"
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`
	}
}));

export default function Channels(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState(-1);
	
	const handleChange = (event, newValue) => {
		console.log(props)
		props.onClick(newValue);
		setValue(newValue);
	};
	
	return (
		<div>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				className={classes.tabs}
			>
				{ props.channels.map( (_channel, i) => (
					<Tab label={_channel.name} />
				))}
			</Tabs>
			<DialogCreateChannel 
				addChannel = {(_name) => props.addChannel(_name)}
			/>
		</div>
	);
}

