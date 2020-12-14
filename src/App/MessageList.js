import React from 'react';
import { Button } from '@material-ui/core';
import appContext from './appContext.js';

import DialogEditMessage from './DialogEditMessage.js';



import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";



const styles = require('./Style.js').styles
const fetchLib = require('./fetch.js')


const useStyles = makeStyles((theme) => ({
	inline: {
		display: "inline"
	}
}));

export default class Message extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props)
		this.state = {
			message : this.props.message,
			channel : this.props.channel
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
	
	editMessage = (newContent) => {
		fetchLib.put(this.context.token, `message/${this.state.message.id}`, {content : newContent})
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
	
	render() {
		
		let stringDeletedEdited = ''
		if(this.state.message.removed && (this.context.loggedUser && this.context.loggedUser.scope.admin))
			stringDeletedEdited = '(removed)'
		if(this.state.message.edited)
			stringDeletedEdited = '(edited)'
		
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
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar alt={this.state.message.author.username + ' username'} src={this.state.message.author.avatar} />
					</ListItemAvatar>
					<ListItemText
						primary = <React.Fragment>
								<Typography
									component="span"
									variant="h6"
								>
									{this.state.message.author.username}
								</Typography>
								{' - '}
								<Typography
									component="span"
									variant="subtitle2" 
									gutterBottom
								>
									{this.dateToString(this.state.message.createdAt)}
								</Typography>
							</React.Fragment>
						secondary={
							<React.Fragment>
								<Typography
									component="span"
									variant="body1"
								>
									{
										this.state.message.content
										// .replace("\n", "<br>")
										// .split(/(\\n +\n)/g)
										// .filter( el => el.trim() )
										// .map( el => <p>{el}</p>)
									}
								</Typography>
							</React.Fragment>
							
						}
					/>
				</ListItem>
				
		)
	}
}
Message.contextType = appContext;



