import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUpLocal } from "../redux/authSlice";
import { useAppSelector } from "../redux/store";
import { signUpValidate } from "../utils/validation";
// import Alert from "../components/AlertErr";

const SignUp = () => {
  const dispatch = useDispatch();
  const validateEmail = useAppSelector((state) => state.user.validateEmail);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    repeat_password: "",
  });
  const [errMissInput, setErrMissInput] = useState(false);

  const { email, firstName, lastName, password, repeat_password } = signUpForm;

  const onChangeSignUpForm = (e) => {
    return setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidateEmail = async (e) => {
    if (e.target.value) {
      await dispatch(checkEmail(e.target.value));
    }
  };

  const handleSignUp = async () => {
    const { error } = signUpValidate({
      email,
      password,
      firstName,
      lastName,
      repeat_password: password,
    });

    if (error) {
      console.log(error);
      setErrMissInput(true);
    } else {
      await dispatch(signUpLocal(signUpForm));
      if (!isAuthenticated) {
        setErrMissInput(true);
      }
    }
  };

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <>
      <Box
        sx={{
          width: "50%",
          height: "100%",
          backgroundColor: "#E7E9EB",
          margin: "60px auto",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography component="h1" fontSize={"50px"}>
          Đăng ký
        </Typography>
        <Stack
          component="form"
          sx={{
            width: "50%",
            margin: "40px auto",
          }}
          spacing={3}
          noValidate
          autoComplete="on"
        >
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            name="email"
            value={email}
            onChange={onChangeSignUpForm}
            onBlur={handleValidateEmail}
            error={validateEmail}
            helperText={validateEmail ? "Email đã được sử dụng" : ""}
          />
          <TextField
            name="firstName"
            label="First Name"
            value={firstName}
            onChange={onChangeSignUpForm}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={lastName}
            onChange={onChangeSignUpForm}
          />
          <TextField
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={onChangeSignUpForm}
          />
          <TextField
            name="repeat_password"
            label="Nhập lại mật khẩu"
            type="password"
            autoComplete="current-password"
            value={repeat_password}
            onChange={onChangeSignUpForm}
          />
          <Button variant="contained" onClick={handleSignUp}>
            Đăng ký
          </Button>
        </Stack>

        <Typography>
          Bạn đã có tài khoản?
          <Link to="/signin">
            <Button>Đăng nhập</Button>
          </Link>
        </Typography>
      </Box>
      {/* <Alert
        err={errMissInput}
        setErr={setErrMissInput}
        severity="error"
        content="Vul lòng nhập lại!!!"
      /> */}
    </>
  );
};

export default SignUp;
