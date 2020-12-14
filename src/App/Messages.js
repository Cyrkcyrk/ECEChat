import React from 'react';
import { Button } from '@material-ui/core';
import appContext from './appContext.js';

import Message from './Message.js';

const styles = require('./Style.js').styles
const fetchLib = require('./fetch.js')

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
			<div style={styles.messages}>
				<ul>
					{ this.props.messages.slice(0).reverse().map( (_message, i) => (
						<span key={'message:' + _message.id}>
							<Message 
								message = {_message}
								channel = {this.props.channel}
							/>
						</span>
					))}
					<div style={{ float:"left", clear: "both" }}
						ref={(el) => { this.messagesEnd = el; }}>
					</div>
				</ul>
			</div>
		)
	}
}
