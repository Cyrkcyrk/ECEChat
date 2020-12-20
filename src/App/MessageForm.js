import React, {useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

import SendIcon from '@material-ui/icons/Send';

const MessageForm = function(props) {

	let textFieldMessage = useRef()
	
	function submitMessage() {
		let message = textFieldMessage.current.value
		textFieldMessage.current.value = ''
		props.addMessage({
			content: message
		})
		
	}
	
	function handleKeyPress(e) {
		if (e.key === 'Enter' && !e.shiftKey) { 
			let message = textFieldMessage.current.value.slice(0, -1)
			textFieldMessage.current.value = ''
			props.addMessage({
				content: message
			})
		}
	}
	
	return (
		<div style={{display:"flex"}}>
			<Box
				width="99%"
			>
			<TextField 
				inputRef={textFieldMessage}
				variant="outlined"
				fullWidth
				multiline
				onKeyUp = {handleKeyPress}
				defaultValue = {props.content}
			/>
			</Box>
			<IconButton 
				color = "primary"
				onClick={submitMessage}
			>
				<SendIcon />
			</IconButton>
		</div>
	)
}

export default MessageForm;