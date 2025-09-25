import * as React from "react";
import {IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {Alert as MantineAlert, AppShell, Button, Center, Dialog, Flex, Stack, Text, Title,} from "@mantine/core";
import {useLocation} from "react-router-dom";

import Footer from "../Footer";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const ConfirmEmail = () => {
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();

  const handleSubmit = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/request_confirmation_email/`,
        {
          method: "POST",
          body: { email: location.state.email },
          authenticate: false, // No token needed for confirmation email request
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
            <Title order={1}>Confirm Email</Title>
            {location.state.email && (
              <>
                <Center>
                  <Text c={"dimmed"}>{location.state.email}</Text>
                </Center>
                <Button
                  type="submit"
                  fullWidth
                  variant="filled"
                  onClick={() => handleSubmit()}
                >
                  Send confirmation email
                </Button>
              </>
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

export default ConfirmEmail;
