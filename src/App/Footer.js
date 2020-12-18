import React from 'react';
import './App.css';
const styles = require('./Style.js').styles

export default class Footer extends React.Component {
	render() {
		return (
			<footer className="App-footer" style={styles.footer}>
				footer
			</footer>
		);
	}
}