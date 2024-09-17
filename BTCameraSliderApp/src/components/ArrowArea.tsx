import useBluetoothData from "../useBluetoothData";
import "./ArrowArea.css";
import SteerButton from "./SteerButton";

const ArrowArea = () => {
  const { sendData } = useBluetoothData();

  return (
    <>
      <div className="arrow-area">
        <SteerButton
          onPress={() => sendData("", "slideLeft", "press")}
          onRelease={() => sendData("", "slideLeft", "release")}
          style={{ gridColumn: "1" }}
        >
          {"Slide Left"}
        </SteerButton>
        <SteerButton
          onPress={() => sendData("", "slideRight", "press")}
          onRelease={() => sendData("", "slideRight", "release")}
          style={{ gridColumn: "3" }}
        >
          {"Slide Right"}
        </SteerButton>
      </div>
      <div className="arrow-area">
        <SteerButton
          onPress={() => sendData("", "tiltUp", "press")}
          onRelease={() => sendData("", "tileUp", "release")}
          style={{ gridColumn: "2" }}
        >
          {"Tilt Up"}
        </SteerButton>
        <SteerButton
          onPress={() => sendData("", "panCCW", "press")}
          onRelease={() => sendData("", "panCCW", "release")}
          style={{ gridColumn: "1" }}
        >
          {"Pan CCW"}
        </SteerButton>
        <SteerButton
          onPress={() => sendData("", "panCCW", "press")}
          onRelease={() => sendData("", "panCCW", "release")}
          style={{ gridColumn: "3" }}
        >
          {"Pan CCW"}
        </SteerButton>
        <SteerButton
          onPress={() => sendData("", "tiltDown", "press")}
          onRelease={() => sendData("", "tileDown", "release")}
          style={{ gridColumn: "2" }}
        >
          {"Tilt Down"}
        </SteerButton>
      </div>
    </>
  );
};

export default ArrowArea;
