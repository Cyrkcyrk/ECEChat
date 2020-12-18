import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function DialogCreateChannel(props) {
	const [open, setOpen] = React.useState(false);
	
	let name = ""
	
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	
	const handleNameChange = (e) => {
		name = e.target.value
	}
	
	const createChannel = () => {
		props.addChannel(name)
		setOpen(false);
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
					primary={'Create channel'}  
				/>
			</ListItem>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle >Create a new channel</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter a name for your channel.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Channel name"
						type="text"
						fullWidth
						onChange = {handleNameChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={createChannel}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}