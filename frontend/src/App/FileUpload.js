//https://www.geeksforgeeks.org/file-uploading-in-react-js/

import React from 'react'; 
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import AppContext from './appContext.js';
const fetchLib = require('./fetch.js')


export default class FileUpload extends React.Component { 
	state = { 
		uploadNumber : 0
	}; 
	
	onFileChange = event => { 
		const formData = new FormData() ;
		formData.append('selectedFile', event.target.files[0]);
		
		console.log(typeof(formData))
		console.log(formData)
		
		fetchLib.postFile(this.context.token, 'uploadAvatar', formData).then(data => {
			console.log(data)
			if(data.status === 201) {
				console.log("Success")
				this.setState({
					uploadNumber : this.state.uploadNumber+1
				})
				this.props.setAvatar(fetchLib.url + '/' + data.content.link + "#" + this.state.uploadNumber)
			}
			else {
				console.log("ERROR")
				console.log(data)
			}
			
		}).catch(e => {
			alert ("Error")
			console.log(e)
		})
		
	}; 
	
	render() { 
		return ( 
			<Box mb={2}>
				<Button
					  variant="contained"
					  component="label"
				>
					  Upload Image
					  <input type="file" hidden onChange={this.onFileChange} /> 
				</Button>
			</Box>
		); 
	} 
}
FileUpload.contextType = AppContext;