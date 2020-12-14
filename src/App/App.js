import React from 'react';
import './App.css';
import Header from './Header.js';
import Main from './MainV2.js';
import Footer from './Footer.js';
import Login from './Login.js';

import appContext from './appContext.js';

const fetchLib = require('./fetch.js')

const styles = require('./Style.js').styles


export default class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.disconnect = () => {
			this.setState ({
				logged : false
			})
		}
		
		this.state = {
			logged: false,
			disconnect : this.disconnect
		}
		
		this.connect = this.connect.bind(this)
		this.fetchChannels = this.fetchChannels.bind(this)
	}
	
	connect = (usrname, passwd) => {
		console.log(this.context)
		return new Promise((resolve, reject) => {
			fetchLib.post("", "login", {
				username : usrname,
				password : passwd
			})
			.then(data => {
				this.setState({
					token : data.content.token,
					loggedUser : data.content,
				})
				this.fetchChannels()
				resolve(data)
			})
			.catch(e => {
				if(e.status !== -1 && e.error.type && e.error.type === 2)
					reject(e.error)
				else {
					alert("Erreur")
					console.log(e)
				}
			})
		})
	}
	
	fetchChannels = () => {
		try {
			const requestOptions = {
				method: 'GET',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.state.token
				}
			};
			fetch('http://localhost:3001/channels', requestOptions)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				this.setState({
					channels : data,
					logged : true
				})
			})
		} catch (e) {
			console.log("EREUR CATCH")
			console.log(e)
		}
	}
	
	
	
	render() {
		if(this.state.logged)
			return (
				<appContext.Provider value={this.state}>
					<div className="App" style={styles.root}>
						<Header />
						<Main 
							token = {this.state.token}
							channels = {this.state.channels}
							disconnect = {() => { this.disconnect()}}
						/>
						<Footer />
					</div>
				</appContext.Provider>
			);
		else
			return (
				<Login 
					login = {(_usrname, _passwd) => this.connect(_usrname, _passwd)}
				/>
			);
	}
}

App.contextType = appContext




