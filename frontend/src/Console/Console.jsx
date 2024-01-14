import { Button, Flex, Input, Space } from "antd";
import React from "react";
import Messages from "./Messages/Messages";

export default function Console() {
  return (
    <Flex
      vertical
      justify="space-between"
      style={{ color: "white", maxHeight: "100vh", height: "100%", backgroundColor: "black" }}
    >
      <Messages />
    </Flex>
  );
}
