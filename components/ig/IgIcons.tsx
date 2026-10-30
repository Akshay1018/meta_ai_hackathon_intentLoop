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
          d="M9.55 21.75V13.1H14.45v8.65h5.35V10.5L12 4.35 4.2 10.5v11.25h5.35Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M12 3.9 4.8 9.4v10.85h5.2v-7.25h4v7.25H19.2V9.4L12 3.9Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle cx={11} cy={11} r={7.25} stroke="currentColor" strokeWidth={1.85} />
      <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" />
    </svg>
  );
}

export function IconReels({ size = 24, active, ...props }: IconProps & { active?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M2.25 7.5A2.25 2.25 0 0 1 4.5 5.25h15a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.85}
        strokeLinejoin="round"
      />
      <path
        d="M9.75 8.25v7.5l6.75-3.75-6.75-3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconShop({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M8.5 7.5V6a3.5 3.5 0 1 1 7 0v1.5"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
      />
      <path
        d="M6 7.5h12l-1.1 11.25H7.1L6 7.5Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconNewPost({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <rect
        x={3.25}
        y={3.25}
        width={17.5}
        height={17.5}
        rx={4}
        stroke="currentColor"
        strokeWidth={1.85}
      />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" />
    </svg>
  );
}

export function IconCreate({ size = 24, ...props }: IconProps) {
  return <IconNewPost size={size} {...props} />;
}

export function IconDm({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M21.5 4.5 12 13l-9.5-8.5A1.5 1.5 0 0 0 2 6.2v11.6A1.5 1.5 0 0 0 3.5 19h17a1.5 1.5 0 0 0 1.5-1.5V6.2a1.5 1.5 0 0 0-2-1.7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMessenger({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M21.75 4.5 12 12.25 2.25 4.5A1.75 1.75 0 0 0 1 6.05v11.4A1.75 1.75 0 0 0 2.75 19.2h18.5A1.75 1.75 0 0 0 23 17.45V6.05a1.75 1.75 0 0 0-1.25-1.55Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
      <path
        d="M21.75 4.5 12 12.25 2.25 4.5v11.4L12 14.5l9.75 1.4V4.5Z"
        fill="currentColor"
        opacity={0.08}
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
        r={8.75}
        stroke="currentColor"
        strokeWidth={active ? 2.15 : 1.85}
        fill="none"
      />
      <circle cx={12} cy={10.25} r={3.1} fill="currentColor" />
      <path
        d="M6.35 17.65c1.15-2.35 3.25-3.85 5.65-3.85s4.5 1.5 5.65 3.85"
        stroke="currentColor"
        strokeWidth={1.85}
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
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconComment({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M20.25 12.05a8.25 8.25 0 1 1-3.25-6.55L20.25 3v9.05Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconShare({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M21.25 3.75 10.5 11.75l10.75 7.75V3.75Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
      <path
        d="M10.5 11.75H3.75v8.5h6.75"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBookmark({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M6.25 3.75h11.5v16.5l-5.75-3.75-5.75 3.75V3.75Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMore({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle cx={5} cy={12} r={1.65} fill="currentColor" />
      <circle cx={12} cy={12} r={1.65} fill="currentColor" />
      <circle cx={19} cy={12} r={1.65} fill="currentColor" />
    </svg>
  );
}

export function IconClose({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCamera({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M7.5 7.5h2.2l1.3-2h4l1.3 2H18a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
      <circle cx={12} cy={13.25} r={3.25} stroke="currentColor" strokeWidth={1.85} />
    </svg>
  );
}

export function IconTagPeople({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <circle cx={9.5} cy={8.5} r={3.25} stroke="currentColor" strokeWidth={1.85} />
      <path
        d="M4.5 18.5c.85-2.65 2.75-4.25 5-4.25s4.15 1.6 5 4.25"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
      />
      <path
        d="M16.5 7.5h4.5M18.75 5.25v4.5"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLocation({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
      <circle cx={12} cy={11} r={2.25} stroke="currentColor" strokeWidth={1.85} />
    </svg>
  );
}

export function IconMusic({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="M9.5 17.5V6.5l8-2v11"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
      <circle cx={7.5} cy={17.5} r={2.25} stroke="currentColor" strokeWidth={1.85} />
      <circle cx={15.5} cy={15.5} r={2.25} stroke="currentColor" strokeWidth={1.85} />
    </svg>
  );
}

export function IconChevronRight({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
