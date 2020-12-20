import React, {useRef, useState, useContext} from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from "@material-ui/pickers";


import FileUpload from './FileUpload.js';
import AppContext from './appContext.js';
let fetchLib = require('./fetch.js');


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogRegister(props) {
	const context = useContext(AppContext)
	
	const textFieldUsername = useRef()
	const textFieldPassword = useRef()
	const [passwordStatus, setPasswordStatus] = useState(false)
	const [avatarLink, setAvatarLink] = useState(fetchLib.url + '/img/Avatar' + context.loggedUser.id)
	const [selectedDate, setSelectedDate] = React.useState(
		context.loggedUser.bday? (
			new Date(context.loggedUser.bday)
		) : (
			new Date()
		)
	);
	const [genre, setGenre] = React.useState(
		context.loggedUser.genre? (
			context.loggedUser.genre
		) : (
			''
		)
	);
	
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};
	
	 const handleGenreChange = (event) => {
		setGenre(event.target.value);
	};
  
	const handleSave = (e) => {
		e.preventDefault(); 
		const data = new FormData(e.target)
		
		let userData = {
			email : data.get("email"),
			bday : data.get("birthday"),
			password : data.get("password"),
			genre : data.get("genre")
		}
		switch (data.get("avatar")) {
			case '1':
			case '2':
			case '3':
			case '4': 
				userData.avatar = {
					type : "Default",
					nb : parseInt(data.get("avatar"), 10)
				}
				break;
			case 'Gravatar':
				userData.avatar = {
					type : 'Gravatar'
				}
				break
			case 'Custom':
				userData.avatar = {
					type : 'Custom',
				}
				break
			default : 
				
		}
		
		fetchLib.put(context.token, `user/${context.loggedUser.id}`, userData)
		.then(data => {
			console.log(data);
			context.setLoggedUser(data.content)
			props.setOpen(false)
		}).catch(e => {
			if(e.status > 0 && e.error.name && (e.error.name === 'TokenExpiredError' || e.error.name === 'JsonWebTokenError')) {
				context.disconnect()
			}
			else if(e.status !== -1 && e.error.type && e.error.type === 2 && e.error.name === 'badPassword') {
				setPasswordStatus(true)
			}
			else {
				alert('Error while updating user')
				console.error(e)
			}
		})
	}
	
	const handleClose = () => {
		props.setOpen(false)
	};
	
	let avatarValue = null
	if(context.loggedUser.avatar && context.loggedUser.avatar.type)
		switch (context.loggedUser.avatar.type) {
			case "Default" : 
				avatarValue = context.loggedUser.avatar.nb + ''
				break
			case "Gravatar" :
				avatarValue = "Gravatar"
				break
			case "Custom" :
				avatarValue = "Custom"
				break
			default :
				avatarValue = null
		}
	
	return (
		<div>
			<Dialog 
				maxWidth={"md"} 
				fullWidth 
				open={props.open} 
				onClose={handleClose} 
				TransitionComponent={Transition}
			>
				<div>
					<Box mt={5}/>
				</div>
				<div style={{display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<form style={{width : "50%"}} onSubmit = {handleSave}>
						<TextField
							inputRef={textFieldUsername}
							// onBlur = {checkUsernameAvailable}
							margin="normal"
							disabled
							fullWidth
							name="username"
							autoFocus
							variant = "outlined"
							label = "Username"
							value = {context.loggedUser.username}
						/>
						<TextField
							variant="outlined"
							required
							fullWidth
							id="email"
							label="Email Address"
							defaultValue = {context.loggedUser.email}
							name="email"
						/>
						<Box mt={1}>
							<FormLabel component="legend">Avatar</FormLabel>
						</Box>
						<Box mt={1}>
							<RadioGroup 
								row 
								name="avatar"
								defaultValue = {avatarValue}
							>
								<FormControlLabel
									value="1"
									control={<Radio />}
									
									label={
										<Tooltip title='Default 1' placement='top'>
											<Avatar 
												alt="Avatar1" 
												src= {fetchLib.url + '/img/Avatar1.png'}
											/>
										</Tooltip>
									}
									labelPlacement="top"
								/>
								<FormControlLabel
									value="2"
									control={<Radio />}
									label={
										<Tooltip title='Default 2' placement='top'>
											<Avatar 
												alt="Avatar2" 
												src= {fetchLib.url + '/img/Avatar2.png'}
											/>
										</Tooltip>
									}
									labelPlacement="top"
								/>
								<FormControlLabel
									value="3"
									control={<Radio />}
									label={
										<Tooltip title='Default 3' placement='top'>
											<Avatar 
												alt="Avatar3" 
												src= {fetchLib.url + '/img/Avatar3.png'}
											/>
										</Tooltip>
									}
									labelPlacement="top"
								/>
								<FormControlLabel
									value="4"
									control={<Radio />}
									label={
										<Tooltip title='Default 4' placement='top'>
											<Avatar 
												alt="Avatar4" 
												src= {fetchLib.url + '/img/Avatar4.png'}
											/>
										</Tooltip>
									}
									labelPlacement="top"
								/>
								<FormControlLabel
									value="Gravatar"
									control={<Radio />}
									label={
										<Tooltip title='Gravatar' placement='top'>
											<Avatar 
												alt='Gravatar' 
												src= {fetchLib.gravatar(context.loggedUser.email, context.loggedUser.id)}
											>
											G
											</Avatar>
										</Tooltip>
									}
									labelPlacement="top"
								/>
								<FormControlLabel
									value="Custom"
									control={<Radio />}
									label={
										<Tooltip title='Custom' placement='top'>
											<Avatar 
												alt='Custom Avatar' 
												src= {avatarLink}
											>
												<AddPhotoAlternateIcon/>
											</Avatar>
										</Tooltip>
									}
									labelPlacement="top"
								/>
							</RadioGroup>
						</Box>
						
						<FileUpload
							setAvatar = {(link) => setAvatarLink(link)}
						/>
						
						
						
						
						
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								fullWidth
								name = "birthday"
								inputVariant="outlined"
								format="MM/dd/yyyy"
								label="Birthday"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									"aria-label": "change date"
								}}
							/>
						</MuiPickersUtilsProvider>
						<Box mt={1}>
							<InputLabel>Genre</InputLabel>
							<Select
								name = 'genre'
								value={genre}
								variant="outlined"
								fullWidth
								onChange={handleGenreChange}
							>
								<MenuItem value={1}>Male</MenuItem>
								<MenuItem value={2}>Female</MenuItem>
								<MenuItem value={3}>Other</MenuItem>
							</Select>
						</Box>
						<Box mt={2}>
							<TextField
								inputRef={textFieldPassword}
								margin="normal"
								required
								fullWidth
								name="password"
								autoFocus
								variant="outlined"
								label = "Confirm with your password"
								type = "password"
								error = {passwordStatus}
								helperText = {passwordStatus? ('Incorrect password') : null}
							/>
						</Box>
						<Button
							type="submit"
							fullWidth
							variant="outlined"
							color="primary"
						>
							Save
						</Button>


					</form>
				</div>
				<div>
					<Box mt={5}/>
				</div>
				
				
				
				
				
			</Dialog>
		</div>
	);
}