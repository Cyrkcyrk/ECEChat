import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import IconButton from "@material-ui/core/IconButton";

import Picker from 'emoji-picker-react';


export default function EmojiPicker(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	const open = Boolean(anchorEl);
	
	const onEmojiClick = (event, emojiObject) => {
		props.addEmoji(emojiObject.emoji)
	};
	
	
	return (
		<span>
			<IconButton 
				onClick={handleClick}
			>
				<SentimentVerySatisfiedIcon />
			</IconButton>
				
			
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
			>
				<Picker onEmojiClick={onEmojiClick} />
			</Popover>
		</span>
	);
};