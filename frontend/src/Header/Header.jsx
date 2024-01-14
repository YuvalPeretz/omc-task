import { Button, Flex, Row } from "antd";
import React from "react";
import Timer from "../Timer/Timer";

export default function Header({ onSideClick, pickedSide }) {
  return (
    <Row style={{ height: "10%" }}>
      <Flex style={{ width: "100%", padding: 10 }} align="center" justify="space-between">
        <Button disabled={!pickedSide} id="back-button" type="primary" onClick={() => onSideClick(null)}>
          ← Back
        </Button>
        <Timer />
        <div />
      </Flex>
    </Row>
  );
}
