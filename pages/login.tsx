import React from 'react';
import styled from "styled-components";
import {NextPage} from "next";
import {Box, Button, Grid, Input, TextField, Typography} from "@mui/material";
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from "../config/firebase";
import Image from "next/image";

const LoginStyled = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);

  return (
    <LoginStyled container width="100%" height="100vh" flex="flex" justifyContent="center" alignItems="center">
      <Box>
        <Button type="button" color="primary" className="form__custom-button" onClick={() => signInWithGoogle()}>
          <Image src="/google.svg" width={20} height={20} alt="google_icon" />
          <Typography component="span" >
            Login With Google
          </Typography>
        </Button>
      </Box>
    </LoginStyled>
  )
}

export default Login;
