// src/BluetoothComponent.js
import { useState } from "react";
import { Point } from "./components/BezierCurve";

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
  const [device, setDevice] = useState<BluetoothDevice>();
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic>();

  const [on, setOn] = useState("OFF");

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

  const sendData = async () => {
    if (characteristic) {
      try {
        const encoder = new TextEncoder();

        let stringPoints: string = "";
        points.forEach((p) => {
          stringPoints = stringPoints.concat(`{x: ${p.x}, y: ${p.y},}`);
        });

        if (on == "ON") {
          setOn("OFF");
        } else {
          setOn("ON");
        }
        const data = encoder.encode(
          `{type: string, key: modeLight, value: ${on}}`
        );
        await characteristic.writeValue(data);
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
      <p>{on}</p>
      <button onClick={requestDevice}>Connect to BLE Device</button>
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default BluetoothComponent;
