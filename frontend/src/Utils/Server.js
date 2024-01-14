import { store } from "../Redux/store";

export async function getTowerData(side) {
  return await sendMessage(`/tower${side ? `/${side}` : ""}`);
}

export async function resetTowerData() {
  return await sendMessage("/actions/reset");
}

export async function getWeekReport() {
  return await sendMessage("/actions/weekReport");
}
export async function setTowerData(side, sensors) {
  return await sendMessage("/action/set", { side, ...sensors });
}

export async function getServerTimer() {
  return await sendMessage("/time");
}

export async function getServerTimePassed() {
  return await sendMessage("/time/passed");
}

export async function getEvents() {
  const { history } = store.getState().eventsHistory;
  return await sendMessage("/actions", { startIndex: history ? history.length : undefined });
}

export async function updateContext(updates) {
  return await sendMessage("/actions/updateContext", updates);
}

export async function getContext() {
  return await sendMessage("/actions/getContext");
}

async function sendMessage(endpoint, body) {
  const res = await fetch(
    `http://localhost:3001${endpoint}`,
    body
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      : undefined
  );

  const data = await res.json();
  return data;
}
