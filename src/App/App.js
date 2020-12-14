import React from 'react';
import Box from '@material-ui/core/Box';

import './App.css';
import Main from './Main.js';
import Login from './Login2.js';

import appContext from './appContext.js';

const fetchLib = require('./fetch.js')


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
	
	register = (usrname, mail, passwd) => {
		return new Promise((resolve, reject) => {
			fetchLib.post("", "user", {
				username : usrname,
				password : passwd,
				email : mail
			})
			.then(data => {
				this.connect(usrname, passwd)
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
	
	checkUsername(username) {
		return new Promise((resolve, reject) => {
			fetchLib.get(this.context.token, `username/${username}`)
			.then(data => {
				resolve(false)
			}).catch(e => {
				if(e.error.type && e.error.type === 2 && e.error.name === 'unknownUser')
					resolve(true)
				else {
					alert('Error while getting by username')
					console.error (e)
					reject(null);
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
					<div className="App">
						<Box
							height="40px"
						/>
						<Main 
							token = {this.state.token}
							channels = {this.state.channels}
							disconnect = {() => { this.disconnect()}}
						/>
					</div>
				</appContext.Provider>
			);
		else
			return (
				<Login 
					login = {(_usrname, _passwd) => this.connect(_usrname, _passwd)}
					checkUsername = {(_usrname) => this.checkUsername(_usrname)}
					register = {(_usrname, _mail, _pswd) => this.register(_usrname, _mail, _pswd)}
					
				/>
			);
	}
}

App.contextType = appContext




