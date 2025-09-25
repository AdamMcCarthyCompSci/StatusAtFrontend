import * as React from "react";
import {useRef} from "react";
import {
  Alert as MantineAlert,
  Anchor,
  AppShell,
  Button,
  Center,
  Dialog,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {isEmail, useForm} from "@mantine/form";
import {IconInfoCircle} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

import Footer from "../Footer";
import {googleAuth} from "../../Utils/google";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const SignIn = () => {
  const emailRef = useRef(null);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("warning");
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/token`,
        {
          method: "POST",
          body: { email: values.email, password: values.password },
          authenticate: false, // No token needed for login
        }
      );

      if (response.ok) {
        const token = await response.json();

        // Redirect if email is unconfirmed
        if (!token.is_confirmed) {
          setSeverity("warning");
          if (!opened) toggle();
          setMessage("This user needs to confirm their email address");
          navigate("/confirm-email", { state: { email: values.email } });
          return;
        }

        // Store tokens
        localStorage.setItem("access_token", token.access);
        localStorage.setItem("refresh_token", token.refresh);

        // Redirect to homepage
        navigate("/");
      } else {
        const errorData = await response.json();
        setSeverity("warning");
        if (!opened) toggle();
        setMessage(errorData.detail || "Invalid login credentials");
      }
    } catch (error) {
      console.error(error);
      setSeverity("warning");
      if (!opened) toggle();
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;

    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/forgot_password/`,
        {
          method: "POST",
          body: { email },
          authenticate: false, // No token needed for password reset
        }
      );

      const responseData = await response.json();

      setSeverity(response.ok ? "success" : "warning");
      if (!opened) toggle();
      setMessage(responseData);
    } catch (error) {
      console.error(error);
      setSeverity("warning");
      if (!opened) toggle();
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    await googleAuth(credentialResponse, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (errorMessage) => {
        setSeverity("warning");
        if (!opened) toggle();
        setMessage(errorMessage);
      },
    });
  };

  return (
    <React.Fragment>
      <AppShell.Main style={{ paddingRight: "0px" }}>
        <Flex
          mih={"90vh"}
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack>
              <Center>
                <Title order={1}>Sign in</Title>
              </Center>
              <TextInput
                withAsterisk
                required
                ref={emailRef}
                label="Email"
                placeholder="Email"
                {...form.getInputProps("email")}
              />
              <PasswordInput
                withAsterisk
                required
                label="Password"
                placeholder="Password"
                {...form.getInputProps("password")}
              />
              <Button type="submit" fullWidth variant="filled">
                Sign In
              </Button>
              <Anchor href="" onClick={handleForgotPassword}>
                Forgot password?
              </Anchor>
              <Anchor href="/sign-up">
                {"Don't have an account? Sign up"}
              </Anchor>
              <GoogleOAuthProvider clientId="431308751816-67o5s967jtja5953sjg4mrpouusjvjt8.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Login Failed")}
                />
              </GoogleOAuthProvider>
            </Stack>
          </form>
        </Flex>
      </AppShell.Main>
      <Footer />
      <Dialog
        component={MantineAlert}
        variant="light"
        color={severity === "success" ? "green" : "red"}
        title={severity === "success" ? "Success" : "Warning"}
        icon={<IconInfoCircle />}
        opened={opened}
        withCloseButton
        onClose={close}
        size="lg"
        radius="md"
      >
        {message}
      </Dialog>
    </React.Fragment>
  );
};

export default SignIn;
