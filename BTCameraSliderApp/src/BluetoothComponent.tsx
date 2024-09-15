// src/BluetoothComponent.js
import React, { useState } from "react";

const BluetoothComponent = () => {
  const [device, setDevice] = useState<BluetoothDevice>();
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic>();

  const [on, setOn] = useState("OFF");

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
        if (on == "ON") {
          setOn("OFF");
        } else {
          setOn("ON");
        }
        const data = encoder.encode(on);
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
      <p>{characteristic?.uuid}</p>
      <p>{on}</p>
      <button onClick={requestDevice}>Connect to BLE Device</button>
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default BluetoothComponent;
