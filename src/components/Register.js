import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () =>{ 
  const { enqueueSnackbar } = useSnackbar();

const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData((nextFormData) => ({ ...nextFormData, [key]: value }));
};
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
 
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const history=useHistory();
  const register = async () => {
   //console.log("e:",`${config.endpoint}/auth/register`);
    //console.log(formData.username);
    if(!validateInput(formData)) return;
    try {
      setLoading(true);
      const res = await axios.post(`${config.endpoint}/auth/register`, {
        username: formData.username,
        password: formData.password
      });
      setLoading(false);
      //console.log(res.status);
      if (res.status === 201){
        enqueueSnackbar('Registered successfully');
        history.push('/login');
        // useEffect(()=>{
        //   <login/>
        // });
        
      }
      // if (res.status === 400)
      //   console.log(res.message);
      
    }
    catch (error) {
      setLoading(false);

      //console.log(error.response);
      if (error.response.status === 400)
        //console.log(error.response);
        enqueueSnackbar(error.response.data.message);
      else
        enqueueSnackbar('Something went wrong. Check that the backend is running,reachable and returns valid JSON.');
      }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username === '')
      enqueueSnackbar('Username is a required field');
    else if (data.username.length < 6)
      enqueueSnackbar('Username must be at least 6 characters');
    else if (data.password === '')
      enqueueSnackbar('Password is a required field');
    else if (data.password.length < 6)
      enqueueSnackbar('Password must be at least 6 characters');
    else if (data.password !== data.confirmPassword)
      enqueueSnackbar('Passwords do not match');
    else
      return true;
    return false;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            onChange={handleInput}
            value={formData.username}
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            onChange={handleInput}
            value={formData.password}
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            onChange={handleInput}
            value={formData.confirmPassword}
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
          />
          {!loading ? (
          <Button className="button" variant="contained" onClick={register}>
            Register Now 
           </Button>
          )
           : (
           <CircularProgress/>)}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
