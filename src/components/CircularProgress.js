import React, { useEffect, useState } from "react";

const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle = ({ colour, pct }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <circle
      style={{transition: 'all 0.7s ease-in-out'}}
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      // remove colour as 0% sets full circumference
      stroke={strokePct !== circ ? colour : ""}
      strokeWidth={"2rem"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.5em"}
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const CircularProgress = ({ percentage, colour='blue', indeterminate }) => {
  const [pct, setPct] = useState(cleanPercentage(percentage));

  useEffect(() => {
    if (indeterminate) {
      const timer = setInterval(() => {
        setPct(pct === 100 ? 0 : pct+10);
        console.log(pct);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [indeterminate, pct])


  return (
    <svg width={200} height={200}>
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle colour="lightgrey" />
        <Circle colour={colour} pct={indeterminate ? pct : percentage} />
      </g>
      {!indeterminate && <Text percentage={percentage} />}
    </svg>
  );
};

export default CircularProgress;
