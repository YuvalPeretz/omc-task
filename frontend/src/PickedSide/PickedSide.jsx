import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { toTitleCase } from "../Utils/Utils";
import "./PickedSide.css";
import SideData from "./SideData/SideData";
import { getServerTimer } from "../Utils/Server";
import { setTime } from "../Redux/Reducers/ServerTimeSlice";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

export default function PickedSide({ pickedSide }) {
  const [isPassedTimeUpdated, setIsPassedTimeUpdated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsPassedTimeUpdated(false);
  }, [pickedSide]);

  useEffect(() => {
    refreshPassedTime();
  }, []);

  async function refreshPassedTime() {
    const timerData = await getServerTimer();

    dispatch(setTime(timerData));
    setIsPassedTimeUpdated(true);
  }

  return isPassedTimeUpdated ? (
    <Flex vertical>
      {toTitleCase(pickedSide)} - Data
      <SideData pickedSide={pickedSide} />
    </Flex>
  ) : (
    <LoadingOutlined />
  );
}
