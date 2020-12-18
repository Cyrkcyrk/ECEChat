import React from 'react';
import { Button } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// import { Input } from '@material-ui/core';


export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login: props.login,
			usernameProperties : {
				variant : "outlined",
				error : false,
				type : "text",
				helperText : false,
				label : "Username",
			},
			passwordProperties : {
				variant : "outlined",
				error : false,
				type : "password",
				helperText : false,
				label : "Password",
			},
			
		};
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleUsernameChange = this.handleUsernameChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
	}
	
	handleSubmit (e) {
		this.state.login(
			this.state.username,
			this.state.password
		)
		.catch(e => {
			console.log("ERREUR: ")
			switch(e.name) {
				case "unknownUser": {
					this.setState({
						usernameProperties : {
							variant : "outlined",
							error : true,
							type : "text",
							helperText : "Unknonw username",
							label : "Username",
						}
					})
					break
				}
				case "badPassword" : {
					this.setState({
						usernameProperties : {
							variant : "outlined",
							error : false,
							type : "text",
							helperText : false,
							label : "Username",
						},
						passwordProperties : {
							variant : "outlined",
							error : true,
							type : "password",
							helperText : "Wrong password",
							label : "Password",
						}
					})
					break
				}
				default : {
					console.log(e);
				}
			}
		})
	}
	
	handleUsernameChange (e) {
		this.setState({username : e.target.value})
	}
	
	handlePasswordChange (e) {
		this.setState({password : e.target.value})
	}
	
	
	render() {
		return (

			<form>
				<TextField
					type = {this.state.usernameProperties.type}
					variant = {this.state.usernameProperties.variant}
					label = {this.state.usernameProperties.label}
					helperText = {this.state.usernameProperties.helperText}
					error = {this.state.usernameProperties.error}
					onChange = {this.handleUsernameChange}
				/>
				<TextField
					type = {this.state.passwordProperties.type}
					variant = {this.state.passwordProperties.variant}
					label = {this.state.passwordProperties.label}
					helperText = {this.state.passwordProperties.helperText}
					error = {this.state.passwordProperties.error}
					onChange = {this.handlePasswordChange}
				/>
				<Button 
					variant="outlined"
					onClick={this.handleSubmit}
					// type="submit"	
				>
					Login
				</Button>
					
			</form>
		)
	}
}