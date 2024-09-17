import useBluetoothData from "../useBluetoothData";
import "./ArrowArea.css";

const ArrowArea = () => {
  const { sendData } = useBluetoothData();

  return (
    <div className="arrow-area">
      <button
        onMouseDown={() => sendData("", "up", "press")}
        onMouseUp={() => sendData("", "up", "release")}
        style={{ gridColumn: "2" }}
      >
        {"^"}
      </button>
      <button style={{ gridColumn: "1" }}>{"<"}</button>
      <button style={{ gridColumn: "3" }}>{">"}</button>
      <button style={{ gridColumn: "2" }}>{"v"}</button>
    </div>
  );
};

export default ArrowArea;
