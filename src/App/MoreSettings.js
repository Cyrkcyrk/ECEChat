import React from "react";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';
import IconButton from "@material-ui/core/IconButton";

export default function MoreSettings(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	
	let IconProps = props.icon
	
	return (
		<span>
			<IconButton 
				onClick={handleClick}
				edge="end"
				color = {props.color ? props.color : ''}
			>
			{
				IconProps? (
					<IconProps />
				) : (
					<MoreIcon />
				)
			}
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
					{ props.buttons.map( (button, i) => (
						button !== null ? (
							<Button
								onClick = {() => {
									setAnchorEl(null);
									button.fct()
								}}
							>
								{button.text}
							</Button>
						) : null
					))}
				</ButtonGroup>
			</Popover>
		</span>
	);
}

