import { useId } from 'react';

const MONTHS = [
  '7月', '8月', '9月', '10月', '11月', '12月',
  '1月', '2月', '3月', '4月', '5月', '6月',
];

interface SparklineProps {
  data: number[];
  width: number;
  height: number;
  pad?: number;
  dots?: boolean;
  labels?: boolean;
  className?: string;
}

/**
 * SVG 折れ線（デモ svgLine 相当）。
 * 上昇=緑 / 下降=赤。カードの小チャートと詳細の大チャートで共用。
 */
export function Sparkline({
  data,
  width,
  height,
  pad = 4,
  dots = false,
  labels = false,
  className,
}: SparklineProps) {
  const gid = useId();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const x = (i: number) => pad + (i * (width - 2 * pad)) / (data.length - 1);
  const y = (v: number) => height - pad - ((v - min) / range) * (height - 2 * pad);

  const points = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const up = data[data.length - 1] >= data[0];
  const color = up ? 'var(--plus)' : 'var(--minus)';
  const area = `${x(0)},${height - pad} ${points} ${x(data.length - 1)},${height - pad}`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {dots &&
        data.map((v, i) => (
          <circle key={i} cx={x(i).toFixed(1)} cy={y(v).toFixed(1)} r="2.5" fill={color} />
        ))}
      {labels &&
        MONTHS.map((m, i) =>
          i % 2 === 0 || i === 11 ? (
            <text
              key={i}
              x={x(i).toFixed(1)}
              y={height - 2}
              fontSize="9"
              fill="var(--muted)"
              textAnchor="middle"
            >
              {m}
            </text>
          ) : null,
        )}
    </svg>
  );
}
