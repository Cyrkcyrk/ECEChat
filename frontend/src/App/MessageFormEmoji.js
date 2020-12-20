import React, {useRef, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

import SendIcon from '@material-ui/icons/Send';

import EmojiPicker from './EmojiPicker.js';

const MessageForm = function(props) {
	const [content, setContent] = useState('')
	let textFieldMessage = useRef()
	
	if(props.content)
		setContent(props.content)
	
	function submitMessage() {
		let message = content
		setContent('')
		props.addMessage({
			content: message
		})
		
	}

	
	function addEmoji (emoji) {
		setContent(content + emoji)
	}
	
	function handleKeyPress(e) {
		if (e.key === 'Enter' && !e.shiftKey) { 
			let message = content.slice(0, -1)
			if(message.trim().length > 0) {
				setContent('')
				props.addMessage({
					content: message
				})
			}
		}
		
	}
	
	return (
		<div style={{display:"flex"}}>
			<Box
				width='98%'
			>
			<TextField 
				inputRef={textFieldMessage}
				
				variant="outlined"
				fullWidth
				multiline
				onKeyUp = {handleKeyPress}
				onChange = {() => {setContent(textFieldMessage.current.value)}}
				value = {content}
			/>
			</Box>
			<EmojiPicker
				addEmoji = {addEmoji}
			/>
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