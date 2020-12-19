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
			localStorage.removeItem('token');
			this.setState ({
				logged : false
			})
		}
		
		this.setLoggedUser = (user) => {
			this.setState ({
				loggedUser : user
			})
		}
		
		this.state = {
			logged: false,
			token : '',
			disconnect : this.disconnect,
			setLoggedUser : this.setLoggedUser,
			sortChannels : this.sortChannels
		}
		this.fetchUserWithToken()
		
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
				localStorage.setItem('token', data.content.token)
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
	
	fetchUserWithToken = () => {
		let token = localStorage.getItem('token')
		console.log(token)
		if(token) {
			fetchLib.get(token, "user")
			.then(data => {
				this.setState({
					token : token
				} , () => {
					this.setState({
						loggedUser : data.content,
					}, 
						this.fetchChannels()
					)
				})
			})
			// 
			.catch(e => {
				alert("Erreur")
				console.log(e)
			})
		}
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
			fetchLib.get(this.state.token, `channels/`)
			.then(data => {
				this.setState({
					channels : data.content,
					logged : true
				}, () => {
					this.sortChannels()
				})
			})
		} catch (e) {
			console.log("EREUR CATCH")
			console.log(e)
		}
	}
	
	
	sortChannels = () => {
		let newChannels = this.state.channels.sort((O1, O2) => {
			let dateO1 = O1.createdAt;
			if(O1.messages && O1.messages.last && O1.messages.last && O1.messages.last.createdAt)
				dateO1 = O1.messages.last.createdAt
			
			let dateO2 = O2.createdAt;
			if(O2.messages && O2.messages.last && O2.messages.last && O2.messages.last.createdAt)
				dateO2 = O2.messages.last.createdAt
			
			return -(dateO1 - dateO2)
		})
		this.setState({
			channels : newChannels
		})
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




