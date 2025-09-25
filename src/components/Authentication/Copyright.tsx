import {Anchor, Title} from "@mantine/core";

function Copyright({ color }) {
  return (
    <Title c={color} order={6}>
      {"Copyright © "}
      <Anchor c={color} href="https://www.crochetcrafters.com/">
        CrochetCrafters
      </Anchor>{" "}
      {new Date().getFullYear()}
      {"."}
    </Title>
  );
}

export default Copyright;
