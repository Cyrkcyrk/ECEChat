import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: '36ch',
		// backgroundColor:
	},

	inline: {
		display: 'inline',
	},
}));


class ChannelThumbnail extends React.Component {
	render() {
		let lastMessage = "No message"
		console.log("LAST MESSAGE")
		console.log(this.props.channel.messages.last)
		console.log(typeof(this.props.channel.messages.last))
		if(typeof(this.props.channel.messages.last) === "object")
			lastMessage = this.props.channel.messages.last.content
		if(lastMessage.length > 30) {
			lastMessage = lastMessage.substring(0,30) + "..."
		}
		
		
		return (
			<ListItem 
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



export default function Channels(props) {
	const classes = useStyles();
	//<Divider variant="inset" component="li" />
	return (
		<List className={classes.root}>
			{ props.channels.map( (_channel, i) => (
				
				<ChannelThumbnail
					key = {_channel.id}
					channel = {_channel}
					id = {i}
					classes = {classes}
					onClick = {() => { props.onClick(i)}}
				/>
			))}
		</List>
	);
}
