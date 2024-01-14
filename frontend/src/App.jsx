import "./App.css";
import { Col, Flex, Row } from "antd";
import AllSidesView from "./AllSidesView/AllSidesView";
import { useEffect, useState } from "react";
import PickedSide from "./PickedSide/PickedSide";
import Console from "./Console/Console";
import Actions from "./Actions/Actions";
import Header from "./Header/Header";
import { getEvents, getTowerData } from "./Utils/Server";
import { useDispatch } from "react-redux";
import { addToHistory } from "./Redux/Reducers/EventsHistorySlice";
import { handleEvents, refreshAllSidesData } from "./Utils/Utils";
import { setSide } from "./Redux/Reducers/SidesSlice";

function App() {
  const [pickedSide, setPickedSide] = useState(null);
  const dispatch = useDispatch();

  async function onSideClick(side) {
    if (side) {
      const data = await getTowerData(side);
      dispatch(setSide(data));
    }
    setPickedSide(side);
  }

  useEffect(() => {
    refreshAllSidesData();
    const intervalId = setInterval(async () => {
      const data = await getEvents();
      dispatch(addToHistory(data.data));
      handleEvents(data.data);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Row style={{ height: "100vh" }}>
        <Col span={8}>
          <Console />
        </Col>
        <Col span={16}>
          <Header onSideClick={onSideClick} pickedSide={pickedSide} />
          <Row style={{ height: "70px", height: "90%", justifyContent: "center" }}>
            <Flex vertical align="center" justify="center">
              {pickedSide ? (
                <PickedSide pickedSide={pickedSide} onSideClick={onSideClick} />
              ) : (
                <AllSidesView onSideClick={onSideClick} />
              )}
            </Flex>
          </Row>
        </Col>
      </Row>
      <Actions />
    </>
  );
}

export default App;
