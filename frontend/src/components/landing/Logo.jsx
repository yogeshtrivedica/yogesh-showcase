export const Logo = ({ size = 40, light = false, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="YT monogram"
  >
    <rect width="64" height="64" rx="14" fill={light ? "#E1F5EE" : "#042C53"} />
    <path d="M14 16H50V21H35V48H29V21H14V16Z" fill={light ? "#042C53" : "#E1F5EE"} />
    <path
      d="M38.5 27L48 48H42.4L40.5 43.5H32.9L31 48H25.6L35.1 27H38.5ZM36.7 32.6L34.3 38.7H39.1L36.7 32.6Z"
      fill={light ? "#0F6E56" : "#85B7EB"}
    />
    <circle cx="51" cy="13" r="4" fill="#0F6E56" />
  </svg>
);
