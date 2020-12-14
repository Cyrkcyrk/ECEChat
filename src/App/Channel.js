import React from 'react';
import appContext from './appContext.js';

import Messages from './MessagesList.js';
import MessageForm from './MessageForm.js';
const styles = require('./Style.js').styles

export default class Channel extends React.Component {
	render() {
		return (
			<div style={styles.channel}>
				<h1>Messages for {this.props.channel.name}</h1>
				<Messages 
					messages={this.props.channel.messagesData}
					channel = {this.props.channel}
				/>
				<MessageForm 
					addMessage = {this.props.addMessage}
				/>
			</div>
		)
	}
}
Channel.contextType = appContext;