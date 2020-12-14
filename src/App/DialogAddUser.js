import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogEditMessage(props) {
	const [open, setOpen] = React.useState(false);
	
	let content = props.content
	
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	
	const handleContentChange = (e) => {
		content = e.target.value
	}
	
	const editMessage = () => {
		console.log(content)
		console.log(props)
		props.editMessage(content)
		setOpen(false);
	}
	return (
		<div>
			<Button variant="outlined" onClick={handleClickOpen}>
				Add User
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle >Edit</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Messages"
						type="text"
						defaultValue = {props.content}
						fullWidth
						onChange = {handleContentChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={editMessage}>
						Edit message
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}