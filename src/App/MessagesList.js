import React from 'react';
import { Button } from '@material-ui/core';
import appContext from './appContext.js';

import Message from './MessageList.js';



import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";



const styles = require('./Style.js').styles
const fetchLib = require('./fetch.js')



const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"

  }
}));

export default class Messages extends React.Component {	
	scrollToBottom = () => {
		this.messagesEnd.scrollIntoView();
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}
	
	render() {
		
		
		return (
			<div style={styles.messages}>
				<List>
					{ this.props.messages.slice(0).reverse().map( (_message, i) => (
						<Message 
							message = {_message}
							channel = {this.props.channel}
						/>
					))}
					<div style={{ float:"left", clear: "both" }}
						ref={(el) => { this.messagesEnd = el; }}>
					</div>
				</List>
			</div>
		)
	}
}
