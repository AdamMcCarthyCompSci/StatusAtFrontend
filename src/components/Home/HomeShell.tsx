import {Button, Center, Group, Space, Stack,} from "@mantine/core";
import {Link as RouterLink} from "react-router-dom";
import {IconBrandInstagram,} from "@tabler/icons-react";
import {useMediaQuery} from "@mantine/hooks";

import Footer from "../Footer";

const HomeShell = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Stack
        gap={"100px"}
        mt={"100px"}
        style={{
          marginTop: "100px",
          margin: "auto",
          width: isMobile ? "100%" : "70%",
        }}
      >
        <Button
          onClick={() =>
            window.open(
              "https://instagram.com/officialcrochetcrafters",
              "_blank",
              "noopener,noreferrer"
            )
          }
          justify="center"
          fullWidth
          leftSection={<IconBrandInstagram />}
          variant="default"
          mt="md"
        >
          Follow us on Instagram!
        </Button>
        <Center>
          <Group spacing={"xs"}>
            <Button
              size="xs"
              variant="subtle"
              component={RouterLink}
              to="/privacy"
            >
              Privacy Policy
            </Button>
            <Button
              size="xs"
              variant="subtle"
              component={RouterLink}
              to="/terms"
            >
              Terms
            </Button>
          </Group>
        </Center>
      </Stack>
      <Space h="5vh" />

      <Footer />
    </>
  );
};

export default HomeShell;
