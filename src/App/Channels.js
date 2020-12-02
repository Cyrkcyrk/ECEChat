import React from 'react';
const styles = require('./Style.js').styles

class ChannelThumbnail extends React.Component {
	render() {
		return (
			<li key={this.props.id} style={styles.channel_thumbnail} onClick={this.props.onClick}>
				<h4>Messages for {this.props.channel.name}</h4>
			</li>
		)
	}
}

export default class Channels extends React.Component {
	constructor (props) {
		super (props)
		this.state = {
			channels : this.props.channels
		}
	}
	
	render() {
		return (
			<div style={styles.channels}>
				<ul>
					{ this.props.channels.map( (_channel, i) => (
						<ChannelThumbnail 
							channel = {_channel}
							id = {i}
							onClick = {() => { this.props.onClick(i)}}
						/>
					))}
				</ul>
			</div>
		);
	}
}
