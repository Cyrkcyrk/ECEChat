import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


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
	const classes = useStyles();
	
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
					
					<form style={{width : "50%"}}>
						<TextField
							margin="normal"
							required
							fullWidth
							name="username"
							autoFocus
							variant = "outlined"
							label = "Username"
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
									margin="normal"
									required
									fullWidth
									name="ConfirmPassword"
									autoFocus
									variant = "outlined"
									label = "Confirm Password"
									type = "password"
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