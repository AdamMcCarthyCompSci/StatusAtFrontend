import React, {useContext} from "react";
import {BackgroundImage, Badge, Button, Card, Center, Group, List, rem, Text, ThemeIcon, Title,} from "@mantine/core";
import {IconCircleCheck} from "@tabler/icons-react";

import mySvg from "../../Images/crochetDesign.svg";
import {UserContext} from "../../Context/User.tsx";
import {makeAuthenticatedRequest} from "../../Utils/authenticated_request";

const PremiumShell = () => {
  const { user } = useContext(UserContext);

  const handleSubmitCheckout = async (tier) => {
    const payload = {
      tier: tier,
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/checkout/`,
        { method: "POST", body: payload }
      );
      if (response.ok) {
        const jsonData = await response.json();

        window.location.href = jsonData.checkout_url;
      } else {
        // Handle error if the response is not ok
        console.error("Error:", response.status);
      }
    } catch (error) {
      // Handle error if the request fails
      console.error("Error:", error);
    }
  };

  const handleCustomerPortal = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/customer_portal/`,
        { method: "GET" }
      );
      if (response.ok) {
        const jsonData = await response.json();
        window.location.href = jsonData.customer_portal_url;
      } else {
        // Handle error if the response is not ok
        console.error("Error:", response.status);
      }
    } catch (error) {
      // Handle error if the request fails
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <Center pt={"10vh"}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          m={"10"}
          w={"50%"}
          withBorder
        >
          <Card.Section>
            <BackgroundImage
              src={mySvg}
              style={{
                height: "100%",
                borderImage: "fill 0 linear-gradient(#0003, #7048e8)",
              }}
            >
              <Center>
                <Title style={{ zIndex: 2 }} c={"white"} p={"xl"}>
                  Premium
                </Title>
              </Center>
            </BackgroundImage>
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={800}>
              With Premium, you can enjoy the following extra features...
            </Text>
            <Badge>Only €3 / Month</Badge>
          </Group>
          <List
            p={"xl"}
            spacing="md"
            size="md"
            center
            icon={
              <ThemeIcon color="violet" size={24} radius="xl">
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
          >
            <List.Item>
              Save up to 100 Grid Patterns{" "}
              <Text size="sm" c="dimmed">
                (cannot save with the free tier)
              </Text>
            </List.Item>
            <List.Item>
              Save up to 100 Symbol Patterns{" "}
              <Text size="sm" c="dimmed">
                (cannot save with the free tier)
              </Text>
            </List.Item>
            <List.Item>
              Save up to 100 Row Counters{" "}
              <Text size="sm" c="dimmed">
                (cannot save with the free tier)
              </Text>
            </List.Item>
            {/*<List.Item>Gain access to exclusive pieces in the Pattern Builder</List.Item>*/}
          </List>
          {user?.tier && (
            <Button
              onClick={() => {
                user?.tier === "PREMIUM"
                  ? handleCustomerPortal()
                  : handleSubmitCheckout("PREMIUM");
              }}
              fullWidth
              mt="md"
              radius="md"
            >
              {user?.tier === "PREMIUM" ? "Manage Premium" : "Get Premium Now"}
            </Button>
          )}
        </Card>
      </Center>
    </React.Fragment>
  );
};

export default PremiumShell;
