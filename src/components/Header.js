import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory, Link } from "react-router-dom";
import React from "react";
import "./Header.css";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";


const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
 const logoutHandle=()=>{
  localStorage.clear();
  window.location.reload();
 }

  //const logedIn = localStorage.getItem('username');
  //console.log(logedIn);
  if(hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>  
        </Box>
       
        <Button
          //disabled={hasHiddenAuthButtons}
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>history.push('/')}
        >
          Back to explore
        </Button>
      </Box>
    );
  }
  else
  {
    if(localStorage.getItem('username')){
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>  
        </Box>
        <TextField 
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          style: { width: '300px' },
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{children(e,500)}}
      />
      <Box className="header-title">
     <img src="avatar.png" alt={localStorage.getItem('username')}></img>
     <p>{localStorage.getItem('username')}</p>
      </Box> 
       
        <Button
        //backgroundColor = {"green"}
        //disabled={hasHiddenAuthButtons}
        onClick={logoutHandle}
        className="btn explore-button"
        variant="text">
        Logout
      </Button>
    
      </Box>
    );
    }
    else{
      return(
        <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>  
        </Box>
        <TextField
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{children(e,500)}}
      />
      <Button
         // disabled={hasHiddenAuthButtons}
          className="explore-button"
          variant="text"
          onClick={()=>history.push('/login')}
        >
          Login
        </Button>
        <Button
        // backgroundColor = {green};
         // disabled={hasHiddenAuthButtons}
          className="btn explore-button"
          variant="text"
          onClick={()=>history.push('/register')}
        >
          Register
        </Button>
        {/* <Box className="header-title">
        <img src="/public/avatar.png" alt="User avatar"></img>
        </Box> 
         
          <Button
          //backgroundColor = {green}
          //disabled={hasHiddenAuthButtons}
          className="btn explore-button"
          variant="text"
        >
          Logout
        </Button> */}
     
        </Box>
      );
     }
  }

};

export default Header;
