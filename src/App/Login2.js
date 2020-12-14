import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DialogRegister from './DialogRegister.js';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(15),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function Login(props) {
	const classes = useStyles();
	const [register, setRegisterOpen] = React.useState(false);
	// const [showPassword, setShowPassword] = useState(false);
	const [showPassword] = useState(false);
	
	const [state, setState] = useState({
		usernameProperties : {
			variant : "outlined",
			error : false,
			helperText : false,
			label : "Username",
		},
		passwordProperties : {
			variant : "outlined",
			error : false,
			helperText : false,
			label : "Password",
		}
	})
	
	const handleSubmit = (e) => {
		e.preventDefault(); 
		const data = new FormData(e.target)
		
		props.login(
			data.get("username"),
			data.get("password")
		)
		.catch(e => {
			switch(e.name) {
				case "unknownUser": {
					setState({
						usernameProperties : {
							variant : "outlined",
							error : true,
							helperText : "Unknonw username",
							label : "Username",
						},
						passwordProperties : state.passwordProperties
					})
					break
				}
				case "badPassword" : {
					setState({
						usernameProperties : {
							variant : "outlined",
							error : false,
							helperText : false,
							label : "Username",
						},
						passwordProperties : {
							variant : "outlined",
							error : true,
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

	return (
		<div className={classes.paper}>
			<DialogRegister
				open = {register}
				setOpen = {(status) => setRegisterOpen(status)}
				checkUsername = {props.checkUsername}
				register = {props.register}
			/>
			<Typography variant="h3">
				ECEChat
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					margin="normal"
					required
					fullWidth
					name="username"
					autoFocus
					variant = {state.usernameProperties.variant}
					error = {state.usernameProperties.error}
					helperText = {state.usernameProperties.helperText}
					label = {state.usernameProperties.label}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					variant = {state.passwordProperties.variant}
					error = {state.passwordProperties.error}
					type = {showPassword ? 'text' : 'password'}
					helperText = {state.passwordProperties.helperText}
					label = {state.passwordProperties.label}
				/>
				
				
				
				<Button
					type="submit"
					fullWidth
					variant="outlined"
					color="primary"
					className={classes.submit}
				>
					Sign In
				</Button>
				<Box display="flex" width="100%" >
					<Box flexGrow={1} >
						<Link href='#' variant="body2">
							{
								//'Forgot password?'
							}
						</Link>
					</Box>
					<Box>
						<Link href='#' variant="body2" onClick = {() => {setRegisterOpen(true)}}>
							Don't have an account? Sign Up
						</Link>
					</Box>
				</Box>
			</form>
		</div>
	);
}