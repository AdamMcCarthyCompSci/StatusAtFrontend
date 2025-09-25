import * as React from "react";
import {
  Alert as MantineAlert,
  Anchor,
  AppShell,
  Button,
  Center,
  Checkbox,
  Dialog,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {isEmail, matchesField, useForm} from "@mantine/form";
import {IconInfoCircle} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

import Footer from "../Footer";
import {googleAuth} from "../../Utils/google";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const SignUp = () => {
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [opened, { toggle, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: { email: "", name: "", password: "", confirmPassword: "", marketingConsent: false },
    validate: {
      email: isEmail("Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: matchesField("password", "Passwords are not the same"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/`,
        {
          method: "POST",
          body: {
            name: values.name,
            email: values.email,
            password: values.password,
            marketing_consent: values.marketingConsent
          },
          authenticate: false, // No token needed for signup
        }
      );

      if (response.ok) {
        setSeverity("success");
        if (!opened) toggle();
        setMessage("Success!");
        navigate("/confirm-email", { state: { email: values.email } });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData[Object.keys(errorData)[0]][0];

        if (errorMessage === "unconfirmed user exists with this email") {
          navigate("/confirm-email", { state: { email: values.email } });
        }

        setSeverity("warning");
        if (!opened) toggle();
        setMessage(errorMessage);
      }
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
                <Title order={1}>Sign up</Title>
              </Center>
              <TextInput
                withAsterisk
                required
                label="Email"
                placeholder="Email"
                {...form.getInputProps("email")}
              />
              <TextInput
                withAsterisk
                required
                label="Name"
                placeholder="Name"
                {...form.getInputProps("name")}
              />
              <PasswordInput
                withAsterisk
                required
                label="Password"
                placeholder="Password"
                {...form.getInputProps("password")}
              />
              <PasswordInput
                withAsterisk
                required
                label="Confirm Password"
                placeholder="Confirm Password"
                {...form.getInputProps("confirmPassword")}
              />
              <Checkbox
                label="I agree to receive updates/emails from Crochet Crafters"
                {...form.getInputProps("marketingConsent", { type: "checkbox" })}
              />
              <Button type="submit" fullWidth variant="filled">
                Sign Up
              </Button>
              <Anchor href="/sign-in">
                {"Already have an account? Sign in"}
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

export default SignUp;
