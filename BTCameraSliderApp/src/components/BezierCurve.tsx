import React, { useState } from "react";

interface Point {
  x: number;
  y: number;
  inTx: number;
  inTy: number;
  outTx: number;
  outTy: number;
  joinedTangents: boolean;
}

const BezierCurve: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([
    {
      x: 50,
      y: 200,
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
  ]);

  const [draggingPoint, setDraggingPoint] = useState<{
    pointIndex: number;
    type: "anchor" | "in-tangent" | "out-tangent";
  } | null>(null);

  const onMouseDown = (
    index: number,
    type: "anchor" | "in-tangent" | "out-tangent",
    e: React.MouseEvent<SVGCircleElement>
  ) => {
    setDraggingPoint({ pointIndex: index, type });
    console.log(e);
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingPoint !== null) {
      const { pointIndex, type } = draggingPoint;
      const newPoints = [...points];

      // Calculate new mouse positions relative to SVG
      const svg = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - svg.left;
      const newY = e.clientY - svg.top;

      if (type === "anchor") {
        // Move both anchor and control points
        const deltaX = newX - newPoints[pointIndex].x;
        const deltaY = newY - newPoints[pointIndex].y;
        newPoints[pointIndex].x = newX;
        newPoints[pointIndex].y = newY;

        // Update both in-tangent and out-tangent relative to anchor movement
        newPoints[pointIndex].inTx += deltaX;
        newPoints[pointIndex].inTy += deltaY;
        newPoints[pointIndex].outTx += deltaX;
        newPoints[pointIndex].outTy += deltaY;
      } else if (type === "in-tangent") {
        // Restrict the in-tangent to the left of the anchor
        const restrictedInTx = Math.min(newX, newPoints[pointIndex].x);
        newPoints[pointIndex].inTx = restrictedInTx;
        newPoints[pointIndex].inTy = newY;

        if (newPoints[pointIndex].joinedTangents) {
          const deltaX = newPoints[pointIndex].x - newPoints[pointIndex].inTx;
          const deltaY = newPoints[pointIndex].y - newPoints[pointIndex].inTy;
          newPoints[pointIndex].outTx = newPoints[pointIndex].x + deltaX;
          newPoints[pointIndex].outTy = newPoints[pointIndex].y + deltaY;
        }
      } else if (type === "out-tangent") {
        const restrictedOutTx = Math.max(newX, newPoints[pointIndex].x);
        newPoints[pointIndex].outTx = restrictedOutTx;
        newPoints[pointIndex].outTy = newY;

        if (newPoints[pointIndex].joinedTangents) {
          const deltaX = newPoints[pointIndex].x - newPoints[pointIndex].outTx;
          const deltaY = newPoints[pointIndex].y - newPoints[pointIndex].outTy;
          newPoints[pointIndex].inTx = newPoints[pointIndex].x + deltaX;
          newPoints[pointIndex].inTy = newPoints[pointIndex].y + deltaY;
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
      // Mirror the in-tangent to the out-tangent when joined
      const deltaX = newPoints[index].x - newPoints[index].inTx;
      const deltaY = newPoints[index].y - newPoints[index].inTy;
      newPoints[index].outTx = newPoints[index].x + deltaX;
      newPoints[index].outTy = newPoints[index].y + deltaY;
    }

    setPoints(newPoints);
  };

  const drawCurve = (i: number) => {
    return `M ${points[i].x},${points[i].y} C ${points[i].outTx},${
      points[i].outTy
    } ${points[i + 1].inTx},${points[i + 1].inTy} ${points[i + 1].x},${
      points[i + 1].y
    }`;
  };

  return (
    <svg
      width="300"
      height="300"
      style={{ border: "1px solid black" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Path that represents the cubic Bézier curve */}
      {points.map((p, i) => (
        <React.Fragment key={i}>
          <line
            x1={p.x}
            y1={p.y}
            x2={p.inTx}
            y2={p.inTy}
            stroke="gray"
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray={10}
          />

          {/* Line from anchor to out-tangent */}
          <line
            x1={p.x}
            y1={p.y}
            x2={p.outTx}
            y2={p.outTy}
            stroke="gray"
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray={10}
          />

          {i < points.length - 1 && (
            <path d={drawCurve(i)} stroke="blue" strokeWidth="2" fill="none" />
          )}

          {/* Anchor Point */}
          <circle
            cx={p.x}
            cy={p.y}
            r={5}
            fill="orange"
            onMouseDown={(e) => onMouseDown(i, "anchor", e)}
            onDoubleClick={() => onDoubleClickAnchor(i)}
          />

          {/* In-Tangent */}
          <circle
            cx={p.inTx}
            cy={p.inTy}
            r={5}
            fill="green"
            onMouseDown={(e) => onMouseDown(i, "in-tangent", e)}
          />

          {/* Out-Tangent */}
          <circle
            cx={p.outTx}
            cy={p.outTy}
            r={5}
            fill="blue"
            onMouseDown={(e) => onMouseDown(i, "out-tangent", e)}
          />

          {/* Line from anchor to in-tangent */}
        </React.Fragment>
      ))}
    </svg>
  );
};

export default BezierCurve;
