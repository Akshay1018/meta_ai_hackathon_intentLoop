import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", ...props };
}

export function IconHome({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg {...base({ size, ...props })} aria-hidden>
        <path
          d="M12 2.1 3 9.5v11.4h6.5v-7H14.5v7H21V9.5L12 2.1Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M12 3.5 4.5 9.5V20h5v-6.5h5V20h5V9.5L12 3.5Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconReels({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <rect x={3} y={3} width={18} height={18} rx={4} stroke="currentColor" strokeWidth={1.75} />
      <path
        d="M8.5 8.5v7l6-3.5-6-3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconCreate({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconDm({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M21.5 4.5 12 13l-9.5-8.5A1.5 1.5 0 0 0 2 6.2v11.6A1.5 1.5 0 0 0 3.5 19h17a1.5 1.5 0 0 0 1.5-1.5V6.2a1.5 1.5 0 0 0-2-1.7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconProfile({ size = 24, active, ...props }: IconProps & { active?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle
        cx={12}
        cy={12}
        r={9}
        stroke="currentColor"
        strokeWidth={active ? 2.25 : 1.75}
        fill="none"
      />
      <circle cx={12} cy={10.5} r={3.25} fill="currentColor" />
      <path
        d="M6.2 18.2c1.2-2.4 3.4-3.9 5.8-3.9s4.6 1.5 5.8 3.9"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconHeart({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M16.5 4.5c-1.7 0-3.2.9-4 2.2-.8-1.3-2.3-2.2-4-2.2-2.6 0-4.7 2.1-4.7 4.7 0 5.2 8.7 9.8 8.7 9.8s8.7-4.6 8.7-9.8c0-2.6-2.1-4.7-4.7-4.7Z"
        fill={filled ? "#ed4956" : "none"}
        stroke={filled ? "#ed4956" : "currentColor"}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconComment({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M20.5 12a8.5 8.5 0 1 1-3.4-6.8L20.5 3v9Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconShare({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M21.5 3.5 10 12l11.5 8.5V3.5ZM10 12H3v9h7"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBookmark({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M6 3.5h12v17l-6-4-6 4v-17Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMore({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle cx={5} cy={12} r={1.5} fill="currentColor" />
      <circle cx={12} cy={12} r={1.5} fill="currentColor" />
      <circle cx={19} cy={12} r={1.5} fill="currentColor" />
    </svg>
  );
}

export function IconAddStory({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle cx={12} cy={12} r={10} fill="#0095f6" />
      <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
