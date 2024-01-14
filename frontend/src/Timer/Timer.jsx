import React, { useState, useEffect } from "react";
import { Input, Popover, Space } from "antd";
import { getServerTimer } from "../Utils/Server";
import { SECOND, getAverageSensorsTemp, logger } from "../Utils/Utils";
import { store } from "../Redux/store";

export default function Timer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [intervalMs, setIntervalMs] = useState(100);
  const CORRECTION_INTERVAL_MS = SECOND;

  useEffect(() => {
    let interval;

    async function alignWithServerTimer() {
      try {
        const timerData = await getServerTimer();
        setTime({ hours: timerData.hours, minutes: timerData.minutes });
        setIntervalMs(timerData.intervalMs);
      } catch (error) {
        console.error("Failed to fetch timer data from the server:", error);
      }
    }

    alignWithServerTimer();

    interval = setInterval(() => {
      setTime((prevTime) => {
        let newMinutes = prevTime.minutes + 1;
        let newHours = prevTime.hours;

        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours = (newHours + 1) % 24;
        }

        if (prevTime.hours !== newHours) {
          const { sides } = store.getState().sidesData;
          const hourlyReport = Object.keys(sides).map((side) => ({ [side]: getAverageSensorsTemp(sides[side]) }));

          logger({
            type: "hourlyReport",
            data: hourlyReport,
          });
        }

        return { hours: newHours, minutes: newMinutes };
      });
    }, intervalMs);

    const correctionInterval = setInterval(alignWithServerTimer, CORRECTION_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearInterval(correctionInterval);
    };
  }, [intervalMs]);

  return (
    <Space direction="vertical" align="center">
      Time
      <Space>
        <Popover content="The timer might be flickering a bit sometimes due to corrections with the server">
          <Input
            value={`${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`}
            style={{ width: 75, textAlign: "center" }}
          />
        </Popover>
      </Space>
    </Space>
  );
}
