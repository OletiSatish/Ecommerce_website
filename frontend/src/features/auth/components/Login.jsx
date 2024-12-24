import {
  Box,
  Card,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  selectLoggedInUser,
  loginAsync,
  selectLoginStatus,
  selectLoginError,
  clearLoginError,
  resetLoginStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/");
    } else if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === "fullfilled" && loggedInUser?.isVerified === true) {
      toast.success(`Login successful`);
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      dispatch(resetLoginStatus());
    };
  }, [status]);

  const handleLogin = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(loginAsync(cred));
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #FFDEE9, #B5FFFC)",
        overflow: "hidden",
      }}
    >
      <Stack
        flexDirection={is900 ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >

        {/* Login Form */}
        <Card
          sx={{
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            width: is480 ? "90vw" : "28rem",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={2}
            color={theme.palette.primary.main}
          >
            Happy Shop
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            mb={4}
            color="text.secondary"
          >
            Sign in to continue
          </Typography>

          <Stack
            component="form"
            spacing={3}
            noValidate
            onSubmit={handleSubmit(handleLogin)}
          >
            <TextField
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email",
                },
              })}
              placeholder="Email"
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              type="password"
              fullWidth
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Password"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <LoadingButton
              fullWidth
              sx={{
                height: "2.5rem",
                borderRadius: "25px",
                textTransform: "none",
              }}
              loading={status === "pending"}
              type="submit"
              variant="contained"
            >
              Login
            </LoadingButton>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mt={3}
          >
            <Typography
              component={Link}
              to="/forgot-password"
              sx={{ textDecoration: "none", color: "text.primary" }}
            >
              Forgot password?
            </Typography>
            <Typography
              component={Link}
              to="/signup"
              sx={{ textDecoration: "none", color: "text.primary" }}
            >
              Don't have an account?{" "}
              <span style={{ color: theme.palette.primary.dark }}>
                Register
              </span>
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
