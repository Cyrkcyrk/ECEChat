import React from 'react';
import Messages from './Messages.js';
import MessageForm from './MessageForm.js';
const styles = require('./Style.js').styles

export default class Channel extends React.Component {
	render() {
		return (
			<div style={styles.channel}>
				<h1>Messages for {this.props.channel.name}</h1>
				<Messages 
					messages={this.props.channel.messages}
				/>
				<MessageForm 
					addMessage = {this.props.addMessage}
					channelID = {this.props.channelID}
				/>
			</div>
		)
	}
}