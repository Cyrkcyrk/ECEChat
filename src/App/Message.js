import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';

import appContext from './appContext.js';
import MessageForm from './MessageForm.js';
import MoreSettings from './MoreSettings.js';

const fetchLib = require('./fetch.js')




export default class Message extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message : this.props.message,
			channel : this.props.channel,
			mouseOver : false,
			edit : false
		};
	}
	
	deleteMessage = () => {
		console.log(this.context)
		fetchLib.delete(this.context.token, `message/${this.state.message.id}`)
		.then(data => {
			let tmpMsg = {...this.state.message}
			tmpMsg.content = data.content.content
			tmpMsg.removed = true
			console.log("tmpMsg")
			console.log(tmpMsg)
			console.log("RECIEVED ANSWER")
			console.log(data.content)
			this.setState({
				message : tmpMsg
			})
		})
		.catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error')
				console.error(e)
			}
		})
	}
	
	showEditDialog = () => {
		console.log("ON EDIIIIT")
	}
	
	editMessage = (msg) => {
		console.log(msg.content)
		this.setEditStatus(false)
		fetchLib.put(this.context.token, `message/${this.state.message.id}`, {content : msg.content})
		.then(data => {
			let tmpMsg = {...this.state.message}
			tmpMsg.content = data.content.content
			tmpMsg.edited = true
			this.setState({
				message : tmpMsg
			})
		})
		.catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error')
				console.error(e)
			}
		})
	}
	
	dateToString = (timestamp) => {
		let leadingZero = (nb) => {
			if (nb < 10)
				return (`0${nb}`)
			return(`${nb}`)
		}
		
		let	dateMessage = new Date(parseInt(timestamp))
		let now = new Date()
		
		if(dateMessage.getDate() === now.getDate() && dateMessage.getMonth() === now.getMonth() && dateMessage.getFullYear() === now.getFullYear())
			return(`Aujourd'hui à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`)
		else if(dateMessage.getDate() === now.getDate()-1 && dateMessage.getMonth() === now.getMonth() && dateMessage.getFullYear() === now.getFullYear())
			return(`Hier à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`)
		else {
			let dateString = `Le ${leadingZero(dateMessage.getDate())}/${leadingZero(dateMessage.getMonth())}/` +
				`${leadingZero(dateMessage.getFullYear())} à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`
			return (dateString)
		}
	}
	
	setMouseOver = (nb) => {
		this.setState({
			mouseOver : nb
		})
	}
	
	setEditStatus = (status) => {
		this.setState({
			edit : status
		})
	}
	
	
	render() {
		
		let stringDeletedEdited = ''
		if(this.state.message.edited && !this.state.message.removed)
			stringDeletedEdited = '(edited)'
		if(this.state.message.removed && (this.context.loggedUser && this.context.loggedUser.scope.admin))
			stringDeletedEdited = '(removed)'
		
		
		let showEditButton = false
		let showDeleteButton = false
		
		if( !this.state.message.removed && 
			(
			   (this.context.loggedUser && this.context.loggedUser.scope.admin)
			|| (this.context.loggedUser && this.context.loggedUser.id === this.state.message.author.id)
			|| (this.context.loggedUser && this.state.channel.admins.includes(this.context.loggedUser.id))
			)
		)
			showDeleteButton = true;
		
		if(!this.state.message.removed &&  
			(
				(this.context.loggedUser && this.context.loggedUser.scope.admin)
			|| (this.context.loggedUser && this.context.loggedUser.id === this.state.message.author.id)
			)
		)
			showEditButton = true;
		
		
		return (
			<ListItem 
				alignItems="flex-start"
				button
				onMouseEnter  ={() => this.setMouseOver(1)}
				onMouseLeave = {() => this.setMouseOver(0)}
			>
				<ListItemAvatar>
					<Avatar alt={this.state.message.author.username + ' username'} src={`${fetchLib.url}/user/${this.state.message.author.id}/avatar#${Math.floor(Math.random() * 1000000)}`} />
				</ListItemAvatar>
				<ListItemText
					
					primary = {
						<Box display="flex" width="100%">
							<Box flexGrow={1} p={1}>
								<Typography
									component="span"
									variant="h6"
									color="textPrimary"
								>
									{this.state.message.author.username}
								</Typography>
								<Typography
									component="span"
									color="textPrimary"
								>
									{' - '}
								</Typography>
								<Typography
									component="span"
									variant="subtitle2" 
									color="textSecondary"
									gutterBottom
								>
									{this.dateToString(this.state.message.createdAt)}
								</Typography>
							</Box>
							{
								this.state.mouseOver ? (
									<Box p={1}>
										<MoreSettings
											buttons = {[
												showDeleteButton ? (
													{
														text : "Delete",
														fct : () => this.deleteMessage()
													}
												) : null,												
												showEditButton ? (
													{
														text : this.state.edit? "Cancel edit" : "Edit",
														fct : (status) => this.setEditStatus(!this.state.edit)
													}
												) : null,
												{
													text : "Copy ID",
													fct : () => navigator.clipboard.writeText(this.state.message.id)
												}, 
											]}
										/>
										
									</Box>
								) : (
									null
								)
							}
						</Box>
					}
					secondary = {
						this.state.edit ? (
							<MessageForm 
								addMessage = {this.editMessage}
								content = {this.state.message.content}
							/>
						
						) : (
							<div style={{display:"flex"}}>
								<React.Fragment>
									{this.state.message.removed ? (
										<Typography
											component="span"
											variant="body1"
											color="textPrimary"
										>
											<Box 
												fontStyle="italic"
												// fontFamily="Monospace"
											>
												{
													this.state.message.content
												}
											</Box >
										</Typography>
									) : (
										<Typography
										component="span"
										variant="body1"
										color="textPrimary"
										>
											{
												this.state.message.content
												// .replace("\n", "<br>")
												// .split(/(\\n +\n)/g)
												// .filter( el => el.trim() )
												// .map( el => <p>{el}</p>)
											}
										</Typography>
									)}
									
									<Typography
										component="span"
										variant="subtitle2" 
										color="textSecondary"
									>
										{stringDeletedEdited}
									</Typography>
								</React.Fragment>
							</div>
						)
					}
				/>
			</ListItem>
				
		)
	}
}
Message.contextType = appContext;



