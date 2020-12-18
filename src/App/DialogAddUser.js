import React, {useState} from 'react';

import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function DialogAddUser(props) {
	const [open, setOpen] = useState(false);
	const [errorText, setErrorText] = useState(false);
	const [user, setUser] = useState(null);
	let userName = ""
	
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setUser(null);
		setErrorText(null);
	};
	
	const handleNameChange = async (e) => {
		userName = e.target.value
		props.getByUsername(userName).then(userTmp => {
			if (!userTmp) {
				if(userName.length > 3)
					setErrorText("Can't find user")
				else
					setErrorText(null)
				setUser(null)
			}
			else {
				console.log("TROUVEEEEE")
				console.log(userTmp)
				setUser(userTmp)
				if(props.channel.members.includes(userTmp.id)) 
					setErrorText('Already member')
				else
					setErrorText(null)
			}
		})
	}
	//`http://localhost:3001/username/${}`
	const addUser = () => {
		console.log("ON AJOUUUTE LOL")
		setOpen(false);
		setUser(null);
		setErrorText(null);
		props.addUser(user.id)
		
	}
	return (
		<div>
			<ListItem 
				button
				onClick={handleClickOpen}
			>
				<ListItemIcon>
					<AddIcon/>
				</ListItemIcon>
				<ListItemText 
					primary={'Add Member'}  
				/>
			</ListItem>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle >Add a new member</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the new member's username.
					</DialogContentText>
					<TextField
						autoFocus
						error = {errorText ? true : false}
						helperText = {errorText}
						margin="dense"
						id="name"
						label="Username"
						type="text"
						fullWidth
						onChange = {handleNameChange}
					/>
					
					{user ? (
						<List>
							<ListItem>
								<ListItemAvatar>
									<Avatar alt={user.username + ' username'} src={user.avatar} />
								</ListItemAvatar>
								<ListItemText primary={user.username} />
							</ListItem>
						</List>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Cancel
					</Button>
					<Button 
					disabled = {!errorText && user ? false : true}
					onClick={addUser}
					
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}