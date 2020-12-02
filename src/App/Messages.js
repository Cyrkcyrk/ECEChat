import React from 'react';
const styles = require('./Style.js').styles


class Message extends React.Component {
	render() {
		return (
			<li key={this.props.id} style={styles.message}>
				<p>
					<span>{this.props.message.author}</span>
					{' '}
					<span>{(new Date(this.props.message.creation)).toString()}</span>
				</p>
				<div>
					{
						this.props.message.content
						// .replace("\n", "<br>")
						.split(/(\\n +\n)/g)
						.filter( el => el.trim() )
						.map( el => <p>{el}</p>)
					}
				</div>
			</li>
		)
	}
}

export default class Messages extends React.Component {	
	render() {
		return (
			<div style={styles.messages}>
				<ul>
					{ this.props.messages.map( (_message, i) => (
						<Message 
							message = {_message}
							id = {i}
						/>
					))}
				</ul>
			</div>
		)
	}
}

