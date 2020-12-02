import React from 'react';
import './App.css';
import Channel from './Channel.js';
import Channels from './Channels.js';

const styles = require('./Style.js').styles


export default class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedChannel: 0,
			channels : this.props.channels
		};
	}
	
	switchChannel(i) {
		this.setState({
			selectedChannel : i
		});
	}
	
	addMessage1(d) {
		console.log("BLABLABLA");
		console.log(d);
	}
	
	addMessage(data) {
		const message = {
			content: data.content,
			author: 'Cyrille',
			creation: Date.now(),
		}
		let tmpChannels = this.state.channels
		tmpChannels[data.channelID].messages = [
			...tmpChannels[data.channelID].messages,
			message
		]
		this.setState({
			channels : tmpChannels
		})
	}
	
	render() {
		const currentChannel = this.state.channels[this.state.selectedChannel]
		return (
			<main className="App-main" style={styles.main}>
				<Channels 
					channels = {this.state.channels}
					onClick = {(i) => this.switchChannel(i)}
				/>
				<Channel 
					channel = {currentChannel}
					channelID = {this.state.selectedChannel}
					addMessage = {(_content, _channelID) => this.addMessage(_content, _channelID)}
				/>
			</main>
		)
	}
}