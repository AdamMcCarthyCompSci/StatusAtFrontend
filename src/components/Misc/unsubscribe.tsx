import React, {useEffect, useState} from "react";
import {Alert as MantineAlert, Button, Dialog, Stack, Title, useMantineTheme,} from "@mantine/core";
import {useParams} from "react-router-dom";
import {IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

// Replace this with your actual API request function
async function makeAuthenticatedRequest(url: string, options: any) {
  return fetch(url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.body),
  });
}

const Unsubscribe = () => {
  const theme = useMantineTheme();
  const { token } = useParams<{ token: string }>();
  const [severity, setSeverity] = useState<"success" | "warning">("success");
  const [message, setMessage] = useState<string>("");
  const [opened, { toggle, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (!token) {
      setSeverity("warning");
      setMessage("Invalid unsubscribe link.");
      toggle();
      return;
    }

    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/unsubscribe/`,
        {
          method: "PATCH",
          body: { token },
          authenticate: false,
        }
      );

      const responseData = await response.json();
      setSeverity(response.ok ? "success" : "warning");
      setMessage(responseData.message || (response.ok ? "You have been unsubscribed." : "Failed to unsubscribe."));
      if (!opened) toggle();
    } catch (error) {
      console.error(error);
      setSeverity("warning");
      setMessage("An error occurred. Please try again.");
      if (!opened) toggle();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUnsubscribe();
  }, [token]);

  return (
    <Stack
      spacing="xl"
      c="white"
      p="md"
      mt="20vh"
      align="center"
      justify="center"
      style={{ minHeight: "50vh" }}
    >
      <Title align="center" order={1} size="h1" p="xl">
        Unsubscribe
      </Title>
      <Button onClick={handleUnsubscribe} loading={loading}>
        {loading ? "Processing..." : "Retry Unsubscribe"}
      </Button>

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
    </Stack>
  );
};

export default Unsubscribe;
