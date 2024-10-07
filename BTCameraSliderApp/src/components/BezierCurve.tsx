import React, { useState, useEffect } from "react";
import useBluetoothData from "../useBluetoothData";

export interface Point {
  time: number;
  pos: number;
  inTTime: number;
  inTPos: number;
  outTTime: number;
  outTPos: number;
  joinedTangents: boolean;
}

const BezierCurve: React.FC = () => {
  const { sendData } = useBluetoothData();

  const [points, setPoints] = useState<Point[]>([
    {
      time: 0,
      pos: 0,
      inTTime: -1,
      inTPos: 0,
      outTTime: 1,
      outTPos: 0,
      joinedTangents: true,
    },
    {
      time: 2,
      pos: 100,
      inTTime: -1,
      inTPos: -0,
      outTTime: 1,
      outTPos: 0,
      joinedTangents: true,
    },
    {
      time: 4,
      pos: 0,
      inTTime: -1,
      inTPos: -0,
      outTTime: 1,
      outTPos: 0,
      joinedTangents: true,
    },
  ]);

  const [draggingPoint, setDraggingPoint] = useState<{
    pointIndex: number;
    type: "anchor" | "in-tangent" | "out-tangent";
  } | null>(null);

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent
  ): { x: number; y: number } => {
    const svg = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - svg.left) / tScale,
      y: (clientY - svg.top) / pScale,
    };
  };

  const pScale: number = 1;
  const tScale: number = 100;

  const scaledPoint = (
    inPoint: Point,
    posScale: number = pScale,
    timeScale: number = tScale
  ) => {
    const outPoint: Point = {
      time: inPoint.time,
      pos: inPoint.pos,
      inTTime: inPoint.inTTime,
      inTPos: inPoint.inTPos,
      outTTime: inPoint.outTTime,
      outTPos: inPoint.outTPos,
      joinedTangents: inPoint.joinedTangents,
    };

    outPoint.pos *= posScale;
    outPoint.time *= timeScale;
    outPoint.inTPos *= posScale;
    outPoint.inTPos += outPoint.pos;
    outPoint.inTTime *= timeScale;
    outPoint.inTTime += outPoint.time;
    outPoint.outTPos *= posScale;
    outPoint.outTPos += outPoint.pos;
    outPoint.outTTime *= timeScale;
    outPoint.outTTime += outPoint.time;

    return outPoint;
  };

  const onMouseDown = (
    index: number,
    type: "anchor" | "in-tangent" | "out-tangent",
    e: React.MouseEvent<SVGCircleElement> | React.TouchEvent<SVGCircleElement>
  ) => {
    e.preventDefault();
    setDraggingPoint({ pointIndex: index, type });
  };

  const onMouseMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (draggingPoint !== null) {
      e.preventDefault(); // Prevent scrolling when dragging
      const { pointIndex, type } = draggingPoint;
      const newPoints = [...points];
      const { x: newX, y: newY } = getCoordinates(e);
      if (type === "anchor") {
        newPoints[pointIndex].time = newX;
        newPoints[pointIndex].pos = newY;
      } else if (type === "in-tangent") {
        const deltaX = newX - newPoints[pointIndex].time;
        const deltaY = newY - newPoints[pointIndex].pos;
        newPoints[pointIndex].inTTime = deltaX;
        newPoints[pointIndex].inTPos = deltaY;
        if (newPoints[pointIndex].joinedTangents) {
          newPoints[pointIndex].outTTime = -newPoints[pointIndex].inTTime;
          newPoints[pointIndex].outTPos = -newPoints[pointIndex].inTPos;
        }
      } else if (type === "out-tangent") {
        const deltaX = newX - newPoints[pointIndex].time;
        const deltaY = newY - newPoints[pointIndex].pos;
        newPoints[pointIndex].outTTime = deltaX;
        newPoints[pointIndex].outTPos = deltaY;
        if (newPoints[pointIndex].joinedTangents) {
          newPoints[pointIndex].inTTime = -newPoints[pointIndex].outTTime;
          newPoints[pointIndex].inTPos = -newPoints[pointIndex].outTPos;
        }
      }
      setPoints(newPoints);
    }
  };

  const onMouseUp = () => {
    setDraggingPoint(null);
  };

  const onDoubleClickAnchor = (index: number) => {
    const newPoints = [...points];
    newPoints[index].joinedTangents = !newPoints[index].joinedTangents;
    if (newPoints[index].joinedTangents) {
      newPoints[index].outTTime = -newPoints[index].inTTime;
      newPoints[index].outTPos = -newPoints[index].inTPos;
    }
    setPoints(newPoints);
  };

  const drawCurve = (i: number) => {
    const p1 = scaledPoint(points[i]);
    const p2 = scaledPoint(points[i + 1]);

    return `M ${p1.time},${p1.pos} C ${p1.outTTime},${p1.outTPos} ${p2.inTTime},${p2.inTPos} ${p2.time},${p2.pos}`;
  };

  useEffect(() => {
    const svgElement = document.querySelector("svg");

    const handleTouchMove = (e: TouchEvent) => {
      onMouseMove(e as any); // Type casting to match the function signature
    };

    const handleTouchEnd = () => {
      onMouseUp();
    };

    svgElement?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    svgElement?.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });

    return () => {
      svgElement?.removeEventListener("touchmove", handleTouchMove);
      svgElement?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <>
      <svg
        width="500"
        height="300"
        style={{ border: "1px solid black" }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* Path that represents the cubic Bézier curve */}
        {points.map((p, i) => {
          const point: Point = scaledPoint(p);

          return (
            <React.Fragment key={i}>
              <line
                x1={point.time}
                y1={point.pos}
                x2={point.inTTime}
                y2={point.inTPos}
                stroke="gray"
                strokeWidth={2}
                strokeOpacity={0.5}
                strokeDasharray={10}
              />

              <line
                x1={point.time}
                y1={point.pos}
                x2={point.outTTime}
                y2={point.outTPos}
                stroke="gray"
                strokeWidth={2}
                strokeOpacity={0.5}
                strokeDasharray={10}
              />

              {i < points.length - 1 && (
                <path
                  d={drawCurve(i)}
                  stroke="blue"
                  strokeWidth="2"
                  fill="none"
                />
              )}

              <circle
                cx={point.time}
                cy={point.pos}
                r={10}
                fill="orange"
                onMouseDown={(e) => onMouseDown(i, "anchor", e)}
                onTouchStart={(e) => onMouseDown(i, "anchor", e)}
                onDoubleClick={() => onDoubleClickAnchor(i)}
              />

              <circle
                cx={point.inTTime}
                cy={point.inTPos}
                r={7}
                fill="green"
                onMouseDown={(e) => onMouseDown(i, "in-tangent", e)}
                onTouchStart={(e) => onMouseDown(i, "in-tangent", e)}
              />

              <circle
                cx={point.outTTime}
                cy={point.outTPos}
                r={7}
                fill="green"
                onMouseDown={(e) => onMouseDown(i, "out-tangent", e)}
                onTouchStart={(e) => onMouseDown(i, "out-tangent", e)}
              />

              <text
                x={point.time}
                y={point.pos + 25}
                fontSize={12}
                fill="black"
              >
                {`{${p.time.toFixed(2)}s, ${p.pos.toFixed(0)}mm}`}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
      <button
        onClick={() => {
          let stringPoints: string = "";
          points.forEach((p) => {
            stringPoints = stringPoints.concat(
              `{time: ${p.time}, pos: ${p.pos}, inTTime: ${p.inTTime}, inTPos: ${p.inTPos}, outTTime: ${p.outTTime}, outTPos: ${p.outTPos},}`
            );
          });

          sendData("string", "XAxisPoints", stringPoints);
        }}
      >
        Send Points
      </button>
    </>
  );
};

export default BezierCurve;
