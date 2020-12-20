import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from '@material-ui/icons/AccountCircle';

import appContext from './appContext.js';
import ChannelsList from './ChannelsList.js'
import ChannelSettingsPanel from './ChannelSettingsPanel.js'
import Channel from './Channel.js'; 
import MoreSettings from './MoreSettings.js';
import DialogUserSettings from './DialogUserSettings.js';

import openSocket from 'socket.io-client';
const fetchLib = require('./fetch.js')


// const socket = openSocket(fetchLib.url, , {transports: ['websocket']});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex"
	},
	appBar: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		width: `calc(100% - 2*${drawerWidth}px)`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginRight: drawerWidth
	},
	title: {
		flexGrow: 1
	},
	hide: {
		display: "none"
	},
	drawerRight: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "flex-end"
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: drawerWidth,
		marginRight: -drawerWidth
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginRight: 0
	}
}));

class MainClass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// selectedChannel: this.props.channels[0],
			channels : this.props.channels,
			rightPannel : false,
			userSettingsStatus : false
		};
		
	}
	
	
	componentDidMount() {
		console.log("ON EST MONTE")
		const socket = openSocket(fetchLib.url)
		socket.emit('message', 'saluuut')
		socket.on('message', data => {
			console.log("SOCKET MESSAGE")
			console.log(data)
		})
		.on('newMessage', data => {
			console.log("SOCKET NEW MESSAGE")
			console.log(data)
		})
	 }
	
	switchChannel = (i) => {
		this.setPanelStatus(false)
		fetchLib.get(this.context.token, `channel/${this.state.channels[i].id}/messages/`)
		.then(data => {
			let tmpSelectedChannel = {...this.state.channels[i]}
			tmpSelectedChannel.messagesData = data.content.reverse()
			tmpSelectedChannel.fcts = {
				user : {
					add : (_userID) => this.addUser(_userID),
					remove : (_userID) => this.removeUser(_userID),
					getByUsername : (_username) => this.getUserByUsername(_username)
					
				},
				admin : {
					add : (_userID) => this.addAdmin(_userID),
					remove : (_userID) => this.removeAdmin(_userID)
				},
				messages : {
					edit : (_msgID, _content) => this.editMessage(_msgID, _content),
					remove : (_msgID) => this.deleteMessage(_msgID)
				}
			}
			
			
			fetchLib.get(this.context.token, `channel/${this.state.channels[i].id}/users/`)
			.then(data => {
				tmpSelectedChannel.usersData = data.content
				this.setState({
					selectedChannel : tmpSelectedChannel
				})
				
			})
			.catch(e => {
				if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
					this.context.disconnect()
				}
				else {
					alert('Error while switching channel')
					console.error(e)
				}
			})
		})
		.catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error while switching channel')
				console.error(e)
			}
		})
	}
	
	addMessage(message) {
		fetchLib.post(this.context.token, "message/", {
			channelID : this.state.selectedChannel.id,
			content : message.content
		}).then(data => {
			
			data.content.author = this.context.loggedUser
			console.log(data);
			let tmpSelectedChannel = {...this.state.selectedChannel}
			tmpSelectedChannel.messagesData.push(data.content)
			tmpSelectedChannel.messages.list.unshift(data.content)
			tmpSelectedChannel.messages.last = data.content
			this.setState({
				selectedChannel : tmpSelectedChannel
			})
		}).catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error while posting new messages')
				console.error(e)
			}
		})
	}
	
	editMessage = (msgID, content) => {
		return new Promise ((resolve, reject) => {
			let messageNB = this.state.selectedChannel.messagesData.findIndex((msg) => {
				if(msg.id === msgID)
					return true
				else
					return false
			})
			
			if(messageNB > -1) {
				fetchLib.put(this.context.token, `message/${msgID}`, {content : content})
				.then(data => {
					let tmpSelectedChannel = {...this.state.selectedChannel}
					tmpSelectedChannel.messagesData[messageNB].content = data.content.content
					tmpSelectedChannel.messagesData[messageNB].edited = true
					
					if(tmpSelectedChannel.messages.last.id === data.content.id)
						tmpSelectedChannel.messages.last = data.content
					
					this.setState({
						selectedChannel : tmpSelectedChannel
					})
					resolve(data.content)
				})
				.catch(e => {
					if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
						this.context.disconnect()
					}
					else {
						alert('Error')
						console.error(e)
						reject(e)
					}
				})
			}
			else {
				alert('Couldn\'t find the message')
			}
		})
	}
	
	deleteMessage = (msgID) => {
		return new Promise ((resolve, reject) => {
			let messageNB = this.state.selectedChannel.messagesData.findIndex((msg) => {
				if(msg.id === msgID)
					return true
				else
					return false
			})
			
			if(messageNB > -1) {
				fetchLib.delete(this.context.token, `message/${msgID}`)
				.then(data => {
					let tmpSelectedChannel = {...this.state.selectedChannel}
					tmpSelectedChannel.messagesData[messageNB].content = data.content.content
					tmpSelectedChannel.messagesData[messageNB].removed = true
					
					if(tmpSelectedChannel.messages.last.id === data.content.id)
						tmpSelectedChannel.messages.last = data.content
					
					this.setState({
						selectedChannel : tmpSelectedChannel
					})
					resolve(data.content)
				})
				.catch(e => {
					if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
						this.context.disconnect()
					}
					else {
						alert('Error')
						console.error(e)
						reject(e)
					}
				})
			}
			else {
				alert('Couldn\'t find the message')
			}
		})
	}
	
	addChannel(name) {
		fetchLib.post(this.context.token, "channel/", {
			name : name
		}).then(data => {
			let tmpListChan = [...this.state.channels]
			console.log(tmpListChan)
			tmpListChan.unshift(data.content)
			
			this.setState({
				channels : tmpListChan
			})
			this.switchChannel(0);
		}).catch(e => {
			alert('Error while creating channel')
			console.error (e)
		})
	}

	addAdmin(userID) {
		fetchLib.put(this.context.token, `channel/${this.state.selectedChannel.id}/admin/${userID}`)
		.then(data => {
			console.log(data.content);
			let tmpSelectedChannel = {...this.state.selectedChannel}
			tmpSelectedChannel.admins = data.content.admins
			this.setState({
				selectedChannel : tmpSelectedChannel
			})
		}).catch(e => {
			alert('Error while adding admin')
			console.error (e)
		})
	}
	
	removeAdmin(userID) {
		fetchLib.delete(this.context.token, `channel/${this.state.selectedChannel.id}/admin/${userID}`)
		.then(data => {
			console.log(data.content);
			let tmpSelectedChannel = {...this.state.selectedChannel}
			tmpSelectedChannel.admins = data.content.admins
			this.setState({
				selectedChannel : tmpSelectedChannel
			})
		}).catch(e => {
			alert('Error while removing admin')
			console.error (e)
		})
	}
	
	addUser(userID) {
		fetchLib.put(this.context.token, `channel/${this.state.selectedChannel.id}/user/${userID}`)
		.then(data => {
			console.log(data.content);
			let chanNb = this.state.channels.findIndex((chan) => {
				if(chan.id === this.state.selectedChannel.id)
					return true
				else
					return false
			})
			let newChannels = [...this.state.channels]
			newChannels[chanNb] = {...data.content}
			
			let tmpSelectedChannel = {...this.state.selectedChannel}
			tmpSelectedChannel.members = data.content.members
			fetchLib.get(this.context.token, `user/${userID}/`)
			.then(data => {
				tmpSelectedChannel.usersData[userID] = data.content
				this.setState({
					channels : newChannels,
					selectedChannel : tmpSelectedChannel
				}, console.log(this.state.selectedChannel))
				
			})
			.catch(e => {
				if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
					this.context.disconnect()
				}
				else {
					alert('Error while switching channel')
					console.error(e)
				}
			})
		}).catch(e => {
			alert('Error while adding user')
			console.error (e)
		})
	}
	
	removeUser(userID) {
		fetchLib.delete(this.context.token, `channel/${this.state.selectedChannel.id}/user/${userID}`)
		.then(data => {
			console.log(data.content);
			let chanNb = this.state.channels.findIndex((chan) => {
				if(chan.id === this.state.selectedChannel.id)
					return true
				else
					return false
			})
			
			
			if(this.context.loggedUser.id === userID && chanNb > -1) {
				let newChannels = [...this.state.channels]
				newChannels.splice(chanNb, 1)
				this.setState({
					channels : newChannels,
					selectedChannel : null
				})
			}
			else if (chanNb > -1) {
				let newChannels = [...this.state.channels]
				newChannels[chanNb] = {...data.content}
				
				let tmpSelectedChannel = {...this.state.selectedChannel}
				tmpSelectedChannel.members = data.content.members
				delete tmpSelectedChannel.usersData[userID]
				
				this.setState({
					channels : newChannels,
					selectedChannel : tmpSelectedChannel
				})
			}
		}).catch(e => {
			alert('Error while removing user')
			console.error (e)
		})
	}
	
	getUserByUsername(username) {
		return new Promise((resolve, reject) => {
			fetchLib.get(this.context.token, `username/${username}`)
			.then(data => {
				resolve(data.content)
			}).catch(e => {
				if(e.error.type && e.error.type === 2 && e.error.name === 'unknownUser')
					resolve(null)
				else {
					alert('Error while getting by username')
					console.error (e)
					reject(null);
				}
			})

		})
	}
	
	setPanelStatus(status) {
		this.setState ({
			rightPannel : status
		})
	}
	
	setUserSettingsStatus(status) {
		this.setState ({
			userSettingsStatus : status
		})
	}
	
	render() {
		return (
			<div className={this.props.classes.root}>
				<DialogUserSettings
					open = {this.state.userSettingsStatus}
					setOpen = {(status) => this.setUserSettingsStatus(status)}
				/>
				<AppBar
					position="fixed"
					className={clsx(this.props.classes.appBar, {
						[this.props.classes.appBarShift]: this.state.rightPannel
					})}
				>
					<Toolbar>
						{this.state.selectedChannel ? (
							<Typography variant="h6" noWrap className={this.props.classes.title}>
								{this.state.selectedChannel.name}
							</Typography>
						) : (<Typography variant="h6" noWrap className={this.props.classes.title}>
								{'ECEChat'}
							</Typography>
						)}
						<MoreSettings
							buttons = {[
								{
									text : "Settings",
									fct : () => this.setUserSettingsStatus(true)
								},
								{
									text : "Logout",
									fct : this.context.disconnect
								}
							]}
							icon = {AccountCircle}
							color = 'inherit'
						/>
						
						{this.state.selectedChannel ? (
							<IconButton
								color="inherit"
								edge="end"
								onClick={() => this.setPanelStatus(true)}
								className={clsx(this.state.rightPannel && this.props.classes.hide)}
							>
								<MenuIcon />
							</IconButton>
						) : (null)}
					</Toolbar>
				</AppBar>

				<ChannelsList
					classes = {this.props.classes}
					channels = {this.state.channels}
					onClick = {(i) => this.switchChannel(i)}
					addChannel = {(_name) => this.addChannel(_name)}
				/>
				
				
				<main
					className={clsx(this.props.classes.content, {
						[this.props.classes.contentShift]: this.state.rightPannel
					})}
				>
					{this.state.selectedChannel ? (
						<Channel 
							channel = {this.state.selectedChannel}
							addMessage = {(_content) => this.addMessage(_content)}
							
						/>
					):null}
				</main>
				
				
				{this.state.selectedChannel ? (
					<ChannelSettingsPanel
						open = {this.state.rightPannel}
						handleDrawerClose = {() => this.setPanelStatus(false)}
						classes = {this.props.classes}
						channel = {this.state.selectedChannel}
					/>
				) : (null)}
				
			</div>
		)
	}
}
MainClass.contextType = appContext;

export default function Main(props) {
	const classes = useStyles();
	const theme = useTheme();

	return (
		<MainClass
			classes = {classes}
			theme = {theme}
			channels = {props.channels}
		/>
	);
}
