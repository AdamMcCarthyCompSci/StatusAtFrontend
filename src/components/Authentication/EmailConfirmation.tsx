import * as React from "react";
import {useCallback, useEffect} from "react";
import {IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {Alert as MantineAlert, AppShell, Button, Dialog, Flex, Stack, Title,} from "@mantine/core";
import {Link as RouterLink, useParams} from "react-router-dom";

import Footer from "../Footer";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const EmailConfirmation = () => {
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [opened, { toggle, close }] = useDisclosure(false);
  const { token } = useParams();

  const handleConfirmEmail = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/confirm_email/`,
        {
          method: "POST",
          body: { token },
          authenticate: false, // No token needed for email confirmation
        }
      );

      if (response.ok) {
        setSeverity("success");
        if (!opened) toggle();
        setMessage("Success! Please sign in");
      } else {
        const errorData = await response.json();
        setSeverity("warning");
        if (!opened) toggle();
        setMessage(errorData);
      }
    } catch (error) {
      console.error(error);
      setSeverity("warning");
      if (!opened) toggle();
      setMessage("An error occurred. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    handleConfirmEmail();
  }, [handleConfirmEmail]);

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
          <Stack>
            <Title order={1}>
              {severity === "success" && opened === true
                ? "Email Confirmed"
                : "Confirming Email..."}
            </Title>
            {severity === "success" && opened === true && (
              <Button component={RouterLink} to="/sign-in">
                Sign In
              </Button>
            )}
          </Stack>
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

export default EmailConfirmation;
