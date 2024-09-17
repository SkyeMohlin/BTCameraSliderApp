// src/BluetoothComponent.js
import { Point } from "./components/BezierCurve";
import useBluetooth from "./useBluetooth";

const points: Point[] = [
  {
    x: 50,
    y: 0,
    inTx: 30,
    inTy: 150,
    outTx: 100,
    outTy: 50,
    joinedTangents: true,
  },
  {
    x: 150,
    y: 200,
    inTx: 150,
    inTy: 150,
    outTx: 150,
    outTy: 50,
    joinedTangents: true,
  },
  {
    x: 250,
    y: 200,
    inTx: 250,
    inTy: 150,
    outTx: 200,
    outTy: 50,
    joinedTangents: true,
  },
];

const BluetoothComponent = () => {
  const { device, setDevice, characteristic, setCharacteristic } =
    useBluetooth();

  let stringPoints: string = "";
  points.forEach((p) => {
    stringPoints = stringPoints.concat(`{x: ${p.x}, y: ${p.y},}`);
  });
  console.log("string", stringPoints);

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

  const sendData = async (
    type: string = "string",
    key: string,
    data: string
  ) => {
    if (characteristic) {
      try {
        const encoder = new TextEncoder();

        const encodedData = encoder.encode(
          `{type: ${type}, key: ${key}, value: ${data}}`
        );
        await characteristic.writeValue(encodedData);
        console.log("Data sent successfully");
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
      console.error("No characteristic available");
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
        <button
          onClick={() => {
            let stringPoints: string = "";
            points.forEach((p) => {
              stringPoints = stringPoints.concat(`{x: ${p.x}, y: ${p.y},}`);
            });

            sendData("string", "XAxisPoints", stringPoints);
          }}
        >
          Send Points
        </button>

        <button onClick={() => sendData("", "bPlay", "")}>Play</button>
        <button onClick={() => sendData("", "bReturnToZero", "")}>
          Return to Zero
        </button>
      </div>
    </div>
  );
};

export default BluetoothComponent;
