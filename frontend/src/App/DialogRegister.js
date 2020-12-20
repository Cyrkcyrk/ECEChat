import React, {useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogRegister(props) {
	const classes = useStyles()
	let textFieldUsername = useRef()
	let textFieldPassword = useRef()
	let textFieldPasswordCheck = useRef()
	let [usernameAvailable, setUsernameAvailable] = useState(true)
	let [passwordMatch, setPasswordMatch] = useState({
			status : 0,
			message : ""
		})
	
	const handleRegister = (e) => {
		e.preventDefault(); 
		const data = new FormData(e.target)
		
		if(usernameAvailable && passwordMatch) {
			console.log(data.get("username"))
			console.log(data.get("email"))
			console.log(data.get("password"))
			props.register(data.get("username"), data.get("email"), data.get("password"))
		}
	}
	
	let checkUsernameAvailable = () => {
		console.log(textFieldUsername.current.value)
		props.checkUsername(textFieldUsername.current.value).then(available => {
			console.log(available)
			setUsernameAvailable(available)
		})
	}
	
	const checkPasswordMatch = (e) => {
		let pswd = textFieldPassword.current.value
		let pswdCheck = textFieldPasswordCheck.current.value
		
		if(pswdCheck.length === 0)
			setPasswordMatch({
				status : 0,
				message : ""
			})
		else {
			if (pswdCheck === pswd)
				setPasswordMatch({
					status : 1,
					message : ""
				})
			else
				setPasswordMatch({
					status : -1,
					message : "Passwords doesn't match"
				})
		}
	}
	
	const handleClose = () => {
		props.setOpen(false);
	};

	return (
		<div>
			<Dialog 
				maxWidth={"md"} 
				fullWidth 
				open={props.open} 
				onClose={handleClose} 
				TransitionComponent={Transition}
			>
				
				<div className={classes.paper}>
					
					<form style={{width : "50%"}} onSubmit = {handleRegister}>
						<TextField
							inputRef={textFieldUsername}
							onBlur = {checkUsernameAvailable}
							margin="normal"
							required
							fullWidth
							name="username"
							autoFocus
							variant = "outlined"
							label = "Username"
							error = {!usernameAvailable ? true : false}
							helperText = {!usernameAvailable? "This username is already taken" : null}
							
						/>
						<TextField
							variant="outlined"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
						/>
						<Box display="flex" width="100%" >
							<Box 
								flexGrow={1}
								width = '48%'
							>
								<TextField
									inputRef={textFieldPassword}
									margin="normal"
									required
									fullWidth
									name="password"
									autoFocus
									variant = "outlined"
									label = "Password"
									type = "password"
								/>
							</Box>
							<Box
								width='4%'
							>
							</Box>
							<Box
								width='48%'
							>
								<TextField
									inputRef={textFieldPasswordCheck}
									onBlur = {checkPasswordMatch}
									margin="normal"
									required
									fullWidth
									name="ConfirmPassword"
									autoFocus
									variant = "outlined"
									label = "Confirm Password"
									type = "password"
									error = {passwordMatch.status === -1 ? true : false}
									helperText = {passwordMatch.message? passwordMatch.message : null}
								/>
							</Box>
						</Box>
						<Button
							type="submit"
							fullWidth
							variant="outlined"
							color="primary"
							className={classes.submit}
						>
							Register
						</Button>


					</form>
				</div>
				<div className={classes.paper}>
				</div>
				
				
				
				
				
			</Dialog>
		</div>
	);
}