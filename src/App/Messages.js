import React from 'react';
import List from "@material-ui/core/List";

import Message from './Message.js';

export default class Messages extends React.Component {	
	scrollToBottom = () => {
		this.messagesEnd.scrollIntoView();
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}
	
	render() {
		return (
			<div>
				<List>
					{ this.props.messages.map( (_message, i) => (
						<Message key={_message.id}
							message = {_message}
							channel = {this.props.channel}
						/>
					))}
					<div style={{ float:"left", clear: "both" }}
						ref={(el) => { this.messagesEnd = el; }}>
					</div>
				</List>
			</div>
		)
	}
}
