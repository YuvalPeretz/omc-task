import { Flex } from "antd";
import React from "react";
import "./AllSidesView.css";

export default function AllSidesView({ onSideClick }) {
  return (
    <>
      <Flex className="side top-bottom-sides" onClick={() => onSideClick("north")} justify="center">
        North
      </Flex>
      <Flex align="center" justify="space-between" style={{ width: 410 }}>
        <Flex className="side right-left-sides" onClick={() => onSideClick("west")} align="center" justify="center">
          West
        </Flex>
        A-Tower
        <Flex className="side right-left-sides" onClick={() => onSideClick("east")} align="center" justify="center">
          East
        </Flex>
      </Flex>
      <Flex className="side top-bottom-sides" onClick={() => onSideClick("south")} justify="center">
        South
      </Flex>
    </>
  );
}
