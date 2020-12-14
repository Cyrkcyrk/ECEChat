import React, {useContext} from "react";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DialogAddUser from './DialogAddUser.js';
import MoreSettings from './MoreSettings.js';
import AppContext from './appContext.js';

function UserTile (props) {
	return (
		<ListItem key={props.user.id}>
			<ListItemAvatar>
				<Avatar alt={props.user.username + ' username'} src={props.user.avatar} />
			</ListItemAvatar>
			<ListItemText primary={props.user.username} />
			{ props.buttons ? (
				<MoreSettings
					buttons = {props.buttons}
				/>
			): null}
		</ListItem>
	)
}


export default function ChannelSettingsPanel(props) {
	const context = useContext(AppContext)
	
	let isLoggedAdmin = false
	if(context.loggedUser && (context.loggedUser.scope.admin || props.channel.admins.includes(context.loggedUser.id)))
		isLoggedAdmin = true
	return(
		<Drawer
			className={props.classes.drawerRight}
			variant="persistent"
			anchor="right"
			open={props.open}
			classes={{
				paper: props.classes.drawerPaper
			}}
		>
			<div className={props.classes.drawerHeader}>
				<IconButton onClick={props.handleDrawerClose}>
					<ChevronRightIcon />
				</IconButton>
			</div>
			<Divider />
				
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
				>
					<Typography >Administrateurs</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List>
					{props.channel.admins.map((userID, index) => (
						<UserTile
							user = {props.channel.usersData[userID]}
							buttons = { isLoggedAdmin ? (
									[
										{
											text : "Remove Admin",
											fct : () => props.channel.fcts.admin.remove(userID)
										}
									]
							) : null }
						/>
					))}
					</List>
				</AccordionDetails>
			</Accordion>
			
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
				>
					<Typography >Membres</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List>
						{props.channel.members.map((userID, index) => (
							props.channel.usersData[userID] ? (
								<UserTile
									user = {props.channel.usersData[userID]}
									buttons = {[
										isLoggedAdmin ? (
											{
												text : "Remove User",
												fct : () => props.channel.fcts.user.remove(userID)
											}
										) : null,												
										isLoggedAdmin && !props.channel.admins.includes(userID) ? (
											{
												text : "Make Admin",
												fct : () => props.channel.fcts.admin.add(userID)
											}
										) : null,
										{
											text : "Copy ID",
											fct : () => navigator.clipboard.writeText(this.state.message.id)
										}, 
									]}
								/>
							) : null
						))}
						
						{isLoggedAdmin ? <Divider /> : null}
						
						{isLoggedAdmin ? (
							<DialogAddUser 
								channel = {props.channel}
								addUser = {(userID) => props.channel.fcts.user.add(userID)}
								getByUsername = {(username) => props.channel.fcts.user.getByUsername(username)}
							/>
						) : null}

					</List>
				</AccordionDetails>
			</Accordion>
			
			
			<Divider />
			<Divider />
			<List>
				<ListItem 
					button
					onClick = {() => props.channel.fcts.user.remove(context.loggedUser.id)}
				>
					<ListItemIcon style={{ color: "red" }}>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText style={{ color: "red" }} primary={"Leave the channel"} />
				</ListItem>
			</List>
		</Drawer>
	)
}
