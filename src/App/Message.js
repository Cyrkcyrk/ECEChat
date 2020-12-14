import React from 'react';
import { Button } from '@material-ui/core';
import appContext from './appContext.js';

import DialogEditMessage from './DialogEditMessage.js';

const styles = require('./Style.js').styles
const fetchLib = require('./fetch.js')

export default class Message extends React.Component {
	constructor(props) {
		super(props);
		
		console.log("PROPPPS MESSAGE")
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
	
	render() {
		
		let leadingZero = (nb) => {
			if (nb < 10)
				return (`0${nb}`)
			return(`${nb}`)
		}
		
		let	dateString = ""
		let	dateMessage = new Date(parseInt(this.state.message.createdAt))
		let now = new Date()
		
		if(dateMessage.getDate() === now.getDate() && dateMessage.getMonth() === now.getMonth() && dateMessage.getFullYear() === now.getFullYear())
			dateString = `Aujourd'hui à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`
		else if(dateMessage.getDate() === now.getDate()-1 && dateMessage.getMonth() === now.getMonth() && dateMessage.getFullYear() === now.getFullYear())
			dateString = `Hier à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`
		
		else
			dateString = `Le ${leadingZero(dateMessage.getDate())}/${leadingZero(dateMessage.getMonth())}/` +
				`${leadingZero(dateMessage.getFullYear())} à ${leadingZero(dateMessage.getHours())}:${leadingZero(dateMessage.getMinutes())}`
		
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

				<li key={this.state.message.id} style={styles.message}>
					<p>
						<span>{this.state.message.author.username}</span>
						{' '}
						<span>{dateString}</span>
						{' '}
						<span>{stringDeletedEdited}</span>
					</p>
					<div>
						{
							this.state.message.content
							// .replace("\n", "<br>")
							.split(/(\\n +\n)/g)
							.filter( el => el.trim() )
							.map( el => <p>{el}</p>)
						}
					</div>
					{
						showDeleteButton ?
						<Button 
							variant="outlined"
							onClick={this.deleteMessage}
						>
							Delete Message
						</Button>
						:null
					}
					{showEditButton ? 
						<DialogEditMessage
							content = {this.state.message.content}
							editMessage = {(_content) => this.editMessage(_content)}
						/>
					: null
					}
				</li>
		)
	}
}
Message.contextType = appContext;