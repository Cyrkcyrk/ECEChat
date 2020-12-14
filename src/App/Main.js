import React from 'react';
import './App.css';
import Channel from './Channel.js';
// import Channels from './Channels.js'; 
// import Channels from './ChannelsTab.js';
// import Channels from './ChannelsList.js';
import Channels from './ChannelDrawer.js';
import appContext from './appContext.js';

const fetchLib = require('./fetch.js')
const styles = require('./Style.js').styles


export default class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token : this.props.token,
			// selectedChannel: this.props.channels[0],
			channels : this.props.channels
		};
	}
	
	switchChannel = (i) => {
		fetchLib.get(this.state.token, `channel/${this.state.channels[i].id}/fetch/`)
		.then(data => {
			let tmpSelectedChannel = {...this.state.channels[i]}
			tmpSelectedChannel.messagesData = data.content
			this.setState({
				selectedChannel : tmpSelectedChannel
			})
		})
		.catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error while switching channel')
				console.error(e)
			}
		})
	}
	
	
	addMessage(message) {
		fetchLib.post(this.props.token, "message/", {
			channelID : this.state.selectedChannel.id,
			content : message.content
		}).then(msg => {
			console.log(msg);
			let tmpSelectedChannel = {...this.state.selectedChannel}
			tmpSelectedChannel.messagesData.unshift(msg.content)
			this.setState({
				selectedChannel : tmpSelectedChannel
			})
		}).catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				this.context.disconnect()
			}
			else {
				alert('Error while posting new messages')
				console.error(e)
			}
		})
	}
	
	addChannel(name) {
		fetchLib.post(this.props.token, "channel/", {
			name : name
		}).then(data => {
			console.log(data.content);
			let tmpSelectedChannel = {...data.content}
			tmpSelectedChannel.messagesData = []
			
			let tmpListChan = [...this.state.channels]
			console.log(tmpListChan)
			tmpListChan.unshift(data.content)
			
			this.setState({
				selectedChannel : tmpSelectedChannel,
				channels : tmpListChan
			})
		}).catch(e => {
			alert('Error while creating channel')
			console.error (e)
		})
	}
	
	render() {
		
		if(this.state.selectedChannel)
			return (
				<main style={styles.main}>
					<Channels 
						channels = {this.state.channels}
						onClick = {(i) => this.switchChannel(i)}
						addChannel = {(_name) => this.addChannel(_name)}
					/>
					<Channel 
						token = {this.props.token}
						channel = {this.state.selectedChannel}
						addMessage = {(_content) => this.addMessage(_content)}
					/>
				</main>
			)
		else 
			return (
				<main className="App-main" style={styles.main}>
					<Channels 
						channels = {this.state.channels}
						onClick = {(i) => this.switchChannel(i)}
						addChannel = {(_name) => this.addChannel(_name)}
					/>
				</main>
			)
	}
}
Main.contextType = appContext;