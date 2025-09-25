import * as React from "react";
import {IconInfoCircle} from "@tabler/icons-react";
import {matchesField, useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";
import {
  Alert as MantineAlert,
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
import {useNavigate} from "react-router-dom";

import Footer from "../Footer";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const ForgotPassword = () => {
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: { email: "", code: "", password: "", confirmPassword: "" },
    validate: {
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: matchesField("password", "Passwords are not the same"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/reset_password/`,
        {
          method: "POST",
          body: {
            email: values.email,
            code: values.code,
            password: values.password,
          },
          authenticate: false, // No token needed for password reset
        }
      );

      if (response.ok) {
        const token = await response.json();
        await localStorage.setItem("access_token", token["access"]);
        await localStorage.setItem("refresh_token", token["refresh"]);

        navigate("/");
      } else {
        const errorData = await response.json();
        setSeverity("warning");
        if (!opened) toggle();
        console.log(errorData);
        setMessage(errorData);
      }
    } catch (error) {
      console.error(error);
      setSeverity("warning");
      if (!opened) toggle();
      setMessage("An error occurred. Please try again.");
    }
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
                <Title order={1}>Forgot Password</Title>
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
                label="Code"
                placeholder="Code"
                {...form.getInputProps("code")}
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
              <Button type="submit" fullWidth variant="filled">
                Reset Password
              </Button>
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

export default ForgotPassword;
