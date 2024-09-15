import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import BluetoothComponent from "./BluetoothComponent";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BluetoothComponent />
    </>
  );
}

export default App;
