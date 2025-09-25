import {AppShell, Center} from "@mantine/core";

import Copyright from "./Authentication/Copyright.tsx";

const Footer = () => {
  return (
    <AppShell.Footer>
        <Center>
          <Copyright style={{ zIndex: 2 }} color={"white"} />
        </Center>
    </AppShell.Footer>
  );
};

export default Footer;
