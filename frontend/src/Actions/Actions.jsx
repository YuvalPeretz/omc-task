import { CalendarOutlined, PlayCircleOutlined, SettingOutlined, UndoOutlined } from "@ant-design/icons";
import { FloatButton, Popover } from "antd";
import React, { useState } from "react";
import { resetTowerData, getWeekReport } from "../Utils/Server";
import { logger, refreshAllSidesData } from "../Utils/Utils";
import SettingsModal from "./SettingsModal/SettingsModal";

export default function Actions() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  async function onResetTowerData() {
    await resetTowerData();
    refreshAllSidesData();
    logger({ type: "reset" });
  }

  async function onGetWeekReport() {
    const report = await getWeekReport();
    logger({ type: "weekReport", data: report });
  }

  return (
    <>
      <FloatButton.Group trigger="click" icon={<PlayCircleOutlined />}>
        <Popover title="Reset sensors" content="Set all sensors to online" placement="left">
          <FloatButton icon={<UndoOutlined />} onClick={onResetTowerData} />
        </Popover>
        <Popover title="Past week reports" content="Logs the tower's week averages" placement="left">
          <FloatButton icon={<CalendarOutlined />} onClick={onGetWeekReport} />
        </Popover>
        <Popover title="Settings" content="Edit the server's settings" placement="left">
          <FloatButton icon={<SettingOutlined />} onClick={() => setSettingsOpen(true)} />
        </Popover>
      </FloatButton.Group>
      <SettingsModal open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  );
}
