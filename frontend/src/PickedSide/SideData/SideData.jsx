import { Badge, Button, Descriptions, Popover, Space, Typography } from "antd";
import React, { useMemo } from "react";
import { getAverageSensorsTemp, getSensorStates, logger } from "../../Utils/Utils";
import { useSelector } from "react-redux";

export default function SideData({ pickedSide }) {
  const data = useSelector((state) => state.sidesData).sides[pickedSide];
  const { online, offline, malfunction } = useMemo(() => getSensorStates(data), [data, pickedSide]);

  function getPrintButton(type) {
    return (
      <Popover content="Print to console the list of sensors">
        <Button
          onClick={() => {
            logger({
              type: "sensors",
              data: {
                side: pickedSide,
                type,
                sensors: type === "total" ? Object.values(getSensorStates(data)).flat() : getSensorStates(data)[type],
                avrg: getAverageSensorsTemp(Object.values(getSensorStates(data)).flat()),
              },
            });
          }}
          size="small"
          type="primary"
        >
          Print
        </Button>
      </Popover>
    );
  }

  return !pickedSide ? (
    <></>
  ) : (
    <Descriptions id="tower-data-holder">
      <Descriptions.Item
        span={3}
        label={
          <Space>
            <Badge color="green" status="processing" text="Online sensors" />
            {getPrintButton("online")}
          </Space>
        }
      >
        {online.length || 0}
      </Descriptions.Item>
      <Descriptions.Item
        span={3}
        label={
          <Space>
            <Badge color="orange" status="processing" text="Malfunctioning sensors" />
            {getPrintButton("malfunction")}
          </Space>
        }
      >
        {malfunction.length || 0}
      </Descriptions.Item>
      <Descriptions.Item
        span={3}
        label={
          <Space>
            <Badge status="error" text="Offline sensors" />
            {getPrintButton("offline")}
          </Space>
        }
      >
        {offline.length || 0}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Space>
            <Typography>Total sensors</Typography>
            {getPrintButton("total")}
          </Space>
        }
      >
        {Object.values(getSensorStates(data)).reduce((sum, arr) => sum + arr.length, 0) || 0}
      </Descriptions.Item>
    </Descriptions>
  );
}
