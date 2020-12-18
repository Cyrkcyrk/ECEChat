exports.styles = {
	root: {
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#565E71',
		padding: '50px',
	},
	header: {
		height: '30px',
		backgroundColor: 'rgba(255,255,255,.3)',
		flexShrink: 0,
	},
	headerLogIn: {
		backgroundColor: 'red',
	},
	headerLogOut: {
		backgroundColor: 'blue',
	},
	footer: {
		height: '30px',
		backgroundColor: 'rgba(255,255,255,.3)',
		flexShrink: 0,
	},
	main: {
		backgroundColor: '#373B44',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
	},
	channels: {
		minWidth: '200px',
	},
	channel: {
		height: '100%',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
	},
	channel_thumbnail : {
		margin: '.2rem',
		padding: '.2rem',
		backgroundColor: 'rgba(255,255,255,.2)',
	},
	messages: {
		flex: '1 1 auto',
		height: '100%',
		overflow: 'auto',
		'& ul': {
		'margin': 0,
		'padding': 0,
		'textIndent': 0,
		'listStyleType': 0,
		},
	},
	message: {
		margin: '.2rem',
		padding: '.2rem',
		// backgroundColor: '#66728E',
		':hover': {
			backgroundColor: 'rgba(255,255,255,.2)',
		},
	},
	form: {
		borderTop: '2px solid #373B44',
		padding: '.5rem',
		display: 'flex',
	},
	content: {
		flex: '1 1 auto',
		marginRight: '.5rem'
	},
	send: {
		backgroundColor: '#D6DDEC',
		padding: '.2rem .5rem',
		border: 'none',
		':hover': {
		backgroundColor: '#2A4B99',
		cursor: 'pointer',
		color: '#fff',
		},
	}
}