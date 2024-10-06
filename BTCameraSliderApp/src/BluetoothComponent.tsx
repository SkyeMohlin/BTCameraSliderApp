// src/BluetoothComponent.js
import FlexBox from "./components/FlexBox";
import useBluetooth from "./useBluetooth";
import useBluetoothData from "./useBluetoothData";

const BluetoothComponent = () => {
  const { sendData } = useBluetoothData();
  const { device, setDevice, characteristic, setCharacteristic } =
    useBluetooth();

  const requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["12345678-1234-5678-1234-56789abcdef0"],
      });
      setDevice(device);

      if (device.gatt) {
        const server = await device.gatt.connect();
        if (server) {
          const service = await server.getPrimaryService(
            "12345678-1234-5678-1234-56789abcdef0"
          ); // Replace with your service UUID
          const characteristic = await service.getCharacteristic(
            "abcdef01-1234-5678-1234-56789abcdef0"
          ); // Replace with your characteristic UUID
          setCharacteristic(characteristic);
        }
      }
    } catch (error) {
      console.error("Error connecting to BLE device:", error);
    }
  };

  return (
    <div>
      <p>{device?.name}</p>
      <p>{characteristic?.uuid}</p>
      <div
        className="buttons-area"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <button onClick={requestDevice}>Connect to BLE Device</button>

        <button onClick={() => sendData("", "bPlay", "")}>Play</button>
        <button onClick={() => sendData("", "bReturnToZero", "")}>
          Return to Zero
        </button>
        <button onClick={() => sendData("", "recordPosition", "")}>
          Record Position
        </button>
        <FlexBox>
          <button onClick={() => sendData("", "changeKP", "-0.1")}>kP-;</button>
          <button onClick={() => sendData("", "changeKP", "0.1")}>kP+;</button>
        </FlexBox>
        <FlexBox>
          <button onClick={() => sendData("", "changeKI", "-0.1")}>kP-;</button>
          <button onClick={() => sendData("", "changeKI", "0.1")}>kP+;</button>
        </FlexBox>
        <FlexBox>
          <button onClick={() => sendData("", "changeKD", "-0.1")}>kP-;</button>
          <button onClick={() => sendData("", "changeKD", "0.1")}>kP+;</button>
        </FlexBox>
      </div>
    </div>
  );
};

export default BluetoothComponent;
