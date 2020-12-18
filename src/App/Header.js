import React from 'react';
import './App.css';
const styles = require('./Style.js').styles

export default class Header extends React.Component {
	render() {
		return (
			<header className="App-header" style={styles.header}>
				<h1>header</h1>
			</header>
		);
	}
}