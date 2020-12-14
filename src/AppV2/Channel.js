import React from 'react';
import Box from '@material-ui/core/Box';

import appContext from './appContext.js';
import Messages from './Messages.js'
import MessageForm from './MessageForm.js';

export default class Channel extends React.Component {
	render() {
		return (
			<div>
				<Box
					width="100%"
				>
					<Messages 
						messages={this.props.channel.messagesData}
						channel = {this.props.channel}
					/>
				</Box>
				<Box 
					width="100%"
				>
					<MessageForm 
						addMessage = {this.props.addMessage}
					/>
				</Box>
			</div>
		)
	}
}
Channel.contextType = appContext;

