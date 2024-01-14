import { Divider, Space, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { getAverageSensorsTemp } from "../../Utils/Utils";

export default function Messages() {
  const { messages } = useSelector((state) => state.console);

  function getMessageString(messageData) {
    switch (messageData.type) {
      case "weekReport":
        return getWeekReportPrint(messageData.data);
      case "hourlyReport":
        return getHourlyReport(messageData.data);
      case "reset":
        return `All sensors are now online`;
      case "sensors":
        return getSensorsPrint(messageData.data);
    }
  }

  function getWeekReportPrint(data) {
    return `Week report:${Object.keys(data).map((side) => {
      const avrg = data[side];

      return `\n ${side} - ${avrg}`;
    })}`;
  }

  function getHourlyReport(data) {
    return `Hourly report:${data.map((sideObj) => {
      const side = Object.keys(sideObj)[0];
      const avrg = sideObj[side];

      return `\n ${side} - ${avrg}`;
    })}`;
  }

  function getSensorsPrint(data) {
    const { type, sensors, side, avrg } = data;

    return `Side - ${side}:\n ${type} ids: ${JSON.stringify(
      sensors.map(({ id }) => id)
    )}\n temperatures: ${JSON.stringify(sensors.map(({ temperature }) => temperature))}\n avrgTemp: ${avrg}`;
  }

  return (
    <Space
      split={<Divider style={{ margin: 0, backgroundColor: "white" }} />}
      direction="vertical"
      style={{ height: "100%", padding: 10, fontFamily: "Consolas", overflowY: "auto" }}
    >
      {messages.length
        ? messages.map((message, i) => (
            <Typography key={i} style={{ whiteSpace: "pre-wrap", color: "white", fontFamily: "Consolas" }}>
              {getMessageString(message)}
            </Typography>
          ))
        : " "}
    </Space>
  );
}
