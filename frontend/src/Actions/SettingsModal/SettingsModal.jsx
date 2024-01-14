import { QuestionCircleTwoTone } from "@ant-design/icons";
import { Descriptions, Divider, Flex, Input, Modal, Popover, Select, Space, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContext, updateContext } from "../../Utils/Server";
import { SECOND } from "../../Utils/Utils";

export default function SettingsModal({ open, setOpen }) {
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const { sides } = useSelector((state) => state.sidesData);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [changes, setChanges] = useState({});
  const [context, setContext] = useState(null);

  useEffect(() => {
    refreshContext();
  }, [open]);

  async function refreshContext() {
    const data = await getContext();
    setContext(data);
  }

  function getExplanation(str) {
    return (
      <Popover content={<Typography style={{ whiteSpace: "pre-wrap" }}>{str}</Typography>}>
        <QuestionCircleTwoTone />
      </Popover>
    );
  }

  async function updateSettings() {
    setConfirmLoading(true);
    await updateContext(changes);
    setConfirmLoading(false);
    setOpen(false);
  }

  return (
    <Modal
      confirmLoading={confirmLoading}
      okText="Update"
      onOk={updateSettings}
      destroyOnClose
      title="Settings"
      open={open}
      onCancel={() => {
        setChanges({});
        setSelectedSide(null);
        setSelectedSensor(null);
        setOpen(false);
      }}
    >
      {context && (
        <Descriptions bordered>
          <Descriptions.Item
            span={3}
            label={
              <Space>
                Events settings
                {getExplanation(
                  `These events are for realistic changes to the sensors of the tower.\nEvents include:\n 1. Occasional disable of sensors\n 2. Occasional temperature changes`
                )}
              </Space>
            }
          >
            <Space split={<Divider style={{ margin: 0 }} />} direction="vertical">
              <Space>
                Enable:
                <Switch
                  onChange={(enabled) => setChanges((prev) => ({ ...prev, events: { ...prev?.events, enabled } }))}
                  defaultChecked={context.events.enabled}
                />
              </Space>
              <Space>
                Chance:
                <Input
                  onChange={(e) =>
                    setChanges((prev) => ({ ...prev, events: { ...prev?.events, chance: +e.target.value } }))
                  }
                  defaultValue={context.events.chance}
                  type="number"
                  min={0}
                  style={{ width: 100 }}
                />
                %{getExplanation("% Of chance to trigger")}
              </Space>
              <Space>
                Temperature Change:
                <Space.Compact>
                  <Input
                    onChange={(e) =>
                      setChanges((prev) => ({
                        ...prev,
                        events: {
                          ...prev?.events,
                          tempChange: [+e.target.value, prev?.events?.tempChange[1] || context.events.tempChange[1]],
                        },
                      }))
                    }
                    defaultValue={context.events.tempChange[0]}
                    type="number"
                    min={0}
                    style={{ width: 65 }}
                  />
                  <Input
                    onChange={(e) =>
                      setChanges((prev) => ({
                        ...prev,
                        events: {
                          ...prev?.events,
                          tempChange: [prev?.events?.tempChange[0] || context.events.tempChange[0], +e.target.value],
                        },
                      }))
                    }
                    defaultValue={context.events.tempChange[1]}
                    type="number"
                    min={0}
                    style={{ width: 65 }}
                  />
                </Space.Compact>
                {getExplanation("[From | To] value of temp changes (can be either positive or negative)")}
              </Space>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label={
              <Space>
                Timer settings
                {getExplanation("The settings of the timer")}
              </Space>
            }
          >
            <Space split={<Divider style={{ margin: 0 }} />} direction="vertical">
              <Space>
                Speed:
                <Input
                  onChange={(e) => setChanges((prev) => ({ ...prev, intervalMs: +e.target.value * SECOND }))}
                  defaultValue={context.time.intervalMs / SECOND}
                  type="number"
                  min={0}
                  style={{ width: 65 }}
                />{" "}
                <p style={{ margin: 0, fontSize: 12 }}>Seconds = 1 Minutes</p>
                {getExplanation("The speed of the timer")}
              </Space>
            </Space>
          </Descriptions.Item>
          {/* <Descriptions.Item span={3} label={<Space>Sensors settings{getExplanation("Adjstment of sensors")}</Space>}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {getExplanation("Set sensors data")}
            <Space.Compact style={{ width: "100%" }}>
              <Select
                allowClear
                onChange={setSelectedSide}
                options={[
                  { label: "North", value: "north" },
                  { label: "South", value: "south" },
                  { label: "East", value: "east" },
                  { label: "West", value: "west" },
                ]}
                placeholder="Side"
              />
              <Select
                allowClear
                onChange={setSelectedSensor}
                disabled={!selectedSide}
                style={{ width: "100%" }}
                options={
                  selectedSide
                    ? sides[selectedSide].map((sensor) => ({
                        label: (
                          <Space>
                            {sensor.id}
                            <Typography.Text type="secondary">{sensor.temperature}</Typography.Text>
                          </Space>
                        ),
                        value: JSON.stringify(sensor),
                      }))
                    : []
                }
                placeholder="Sensor Id"
              />
            </Space.Compact>
            <Space>
              {selectedSensor && (
                <>
                  <Space>
                    Enabled:
                    <Switch />
                  </Space>
                  <Input
                    style={{ width: 100 }}
                    onChange={(e) => console.log(e.target.value)}
                    type="number"
                    defaultValue={JSON.parse(selectedSensor).temperature}
                  />
                </>
              )}
            </Space>
          </Space>
        </Descriptions.Item> */}
        </Descriptions>
      )}
    </Modal>
  );
}
