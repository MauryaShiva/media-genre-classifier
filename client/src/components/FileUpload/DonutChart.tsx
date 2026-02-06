import React from "react";

const COLORS = ["#4C1D95", "#6D28D9", "#8B5CF6"];

interface DonutChartProps {
  data: any[];
  animationsEnabled: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, animationsEnabled }) => {
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden>
      <g transform="translate(100,100) rotate(-90)">
        <circle
          r={radius}
          cx="0"
          cy="0"
          fill="transparent"
          stroke="#eef2ff"
          strokeWidth={strokeWidth}
          className="dark:stroke-gray-800"
        />
        {data.map((item: any, index: number) => {
          const pct = Math.max(0, Math.min(1, item.confidence || 0));
          const dash = pct * circumference;
          const circle = (
            <circle
              key={item.genre}
              r={radius}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={COLORS[index] ?? COLORS[2]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className={
                animationsEnabled ? "transition-all duration-700 ease-out" : ""
              }
            />
          );
          offset += dash;
          return circle;
        })}
      </g>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold fill-violet-700 dark:fill-violet-400"
        style={{ fontSize: 18 }}
      >
        Top 3
      </text>
    </svg>
  );
};

export default DonutChart;
