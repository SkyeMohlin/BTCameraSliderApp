import { ReactNode } from "react";

interface SteerButtonProps {
  children: ReactNode;
  onPress: () => void;
  onRelease: () => void;
  style?: {};
}

const SteerButton = ({
  children,
  onPress,
  onRelease,
  style,
}: SteerButtonProps) => {
  return (
    <button
      onMouseDown={onPress}
      onTouchStart={onPress}
      onMouseLeave={onRelease}
      onMouseUp={onRelease}
      onTouchEnd={onRelease}
      style={style || ""}
    >
      {children}
    </button>
  );
};

export default SteerButton;
