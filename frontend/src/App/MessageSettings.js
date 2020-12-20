import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

export default function MessageSettings(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	
	return (
		<span>
			<IconButton 
				onClick={handleClick}
			>
				<MoreIcon />
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<ButtonGroup
					orientation="vertical"
					color="primary"
					aria-label="vertical outlined primary button group"
				>
					{
						props.showDeleteButton ? (
							<Button
								onClick = {() => {
									setAnchorEl(null);
									props.deleteMessage()
								}}
							>
								Delete
							</Button>
						) : null
					}
					{
						props.showEditButton ? (
							props.editStatus ? (
								<Button
									onClick = {() => {
										setAnchorEl(null);
										props.editMessage(false)
									}}
								>
									{'Cancel Edit'}
								</Button>
							) : (
								<Button
									onClick = {() => {
										setAnchorEl(null);
										props.editMessage(true)
									}}
								>
									{'Edit'}
								</Button>
							)
						) : null
					}
					<Button
						onClick={() => {
							navigator.clipboard.writeText(props.messageID)
							setAnchorEl(null);
						}}
					>
						Copy ID
					</Button>
				</ButtonGroup>
			</Popover>
		</span>
	);
}