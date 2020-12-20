import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import DialogCreateChannel from './DialogCreateChannel.js';

class ChannelThumbnail extends React.Component {
	render() {
		let lastMessage = "No message"
		if(typeof(this.props.channel.messages.last) === "object")
			lastMessage = this.props.channel.messages.last.content
		if(lastMessage.length > 30) {
			lastMessage = lastMessage.substring(0,30) + "..."
		}
		
		
		return (
			<ListItem 
				button
				alignItems="flex-start" 
				onClick={this.props.onClick}
			>
				<ListItemAvatar>
					<Avatar alt={this.props.channel.name} src="/static/images/avatar/1.jpg" />
				</ListItemAvatar>
				<ListItemText
					primary={this.props.channel.name}
					secondary={
						<React.Fragment>
							{lastMessage}
						</React.Fragment>
					}
				/>
			</ListItem>
		)
	}
}


export default function PanelLeft(props) {
	return (
		<Drawer
			className={props.classes.drawer}
			variant="persistent"
			anchor="left"
			open={true}
			classes={{
				paper: props.classes.drawerPaper
			}}
		>
			<div className={props.classes.drawerHeader}></div>
			<Divider />
			<List>
				{ props.channels.map( (_channel, i) => (
					<ChannelThumbnail
						key = {_channel.id}
						channel = {_channel}
						id = {i}
						onClick = {() => { props.onClick(i)}}
					/>
				))}
			</List>
			<Divider />
			<List>
				<DialogCreateChannel 
					addChannel = {(name) => props.addChannel(name)}
				/>
			</List>
			<Divider />
		</Drawer>
	)
}
