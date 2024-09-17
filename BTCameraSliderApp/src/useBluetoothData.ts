import useBluetooth from "./useBluetooth";

const useBluetoothData = () => {
    const { characteristic } = useBluetooth();

    const sendData = async (
        type: string = "string",
        key: string,
        data: string
      ) => {
        console.log("Attempting to send: '", data, "' to Key: ", key);
        

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
    
    return {sendData};
}

export default useBluetoothData;