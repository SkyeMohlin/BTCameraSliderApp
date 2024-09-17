import { create } from "zustand";

interface BluetoothStore {
    device: BluetoothDevice | undefined;
    setDevice: (device: BluetoothDevice) => void;
    characteristic: BluetoothRemoteGATTCharacteristic | undefined;
    setCharacteristic: (characteristic: BluetoothRemoteGATTCharacteristic) => void;
}

const useBluetooth = create<BluetoothStore>((set) => ({
    device: undefined,
    setDevice: (d) => set(() => ({device: d})),
    characteristic: undefined,
    setCharacteristic: (ch) => set(() => ({characteristic: ch}))
}))

export default useBluetooth;