import Svg, { Path } from 'react-native-svg'

type LogoMarkProps = {
  size?: number
  color?: string
}

export function LogoMark({ size = 44, color = '#ffffff' }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M9 12.5A5.5 5.5 0 0 1 14.5 7h19A5.5 5.5 0 0 1 39 12.5v13A5.5 5.5 0 0 1 33.5 31H23l-8.5 7v-7A5.5 5.5 0 0 1 9 25.5v-13Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M17 18h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M17 23h9" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}
