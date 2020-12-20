import React from 'react';
import Box from '@material-ui/core/Box';

import Messages from './Messages.js'
import MessageFormEmoji from './MessageFormEmoji.js';


export default function Channel (props) {
	return (
		<div>
			<Box
				width="100%"
			>
				<Messages 
					messages={props.channel.messagesData}
					channel = {props.channel}
				/>
			</Box>
			<Box 
				width="100%"
			>
				<MessageFormEmoji 
					addMessage = {props.addMessage}
				/>
			</Box>
		</div>
	)
}

