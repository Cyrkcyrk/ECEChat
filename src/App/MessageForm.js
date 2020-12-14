import React from 'react';
const styles = require('./Style.js').styles

const MessageForm = function(props) {

	function onSubmit(e) {
		e.preventDefault()
		const data = new FormData(e.target)
		props.addMessage({
			content: data.get('content'),
		})
		e.target.elements.content.value = ''
	}
	return (
		<form style={styles.form}  onSubmit={onSubmit}>
			<input type="input" name="content" style={styles.content} />
			<input type="submit" value="Send" style={styles.send} />
		</form>
	)
}

export default MessageForm;