export function Logo({
  color = "currentColor",
  strokeWidth = 15,
  size = 270,
}: {
  color?: string;
  strokeWidth?: number;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * (254 / 270)}
      viewBox="0 0 270 254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M88.3385 243.5L32.783 204.938L83.7089 141.696L9.63483 120.101L31.2398 56.8595L103.771 83.0817L102.227 7.5H167.042L165.499 83.0817L236.487 58.402L259.635 121.644L185.561 141.696L234.943 204.938L180.931 243.5L134.635 178.716L88.3385 243.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
