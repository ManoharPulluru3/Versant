import { useMemo } from 'react'
import { View } from 'react-native'
import { iconToSVG } from '@iconify/utils'
import { SvgXml } from 'react-native-svg'
import { ICONIFY_ICONS } from '../generated/iconify-bundle'

function buildSvgXml(
  iconData: { width: number; height: number; body: string },
  size: number,
  color: string,
) {
  const svg = iconToSVG(iconData, { height: size })
  const body = svg.body.replace(/currentColor/g, color)
  const width = svg.attributes.width || size
  const height = svg.attributes.height || size
  const slash = '/'
  return `<svg xmlns="${'http:'}${slash}${slash}www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${iconData.width} ${iconData.height}">${body}</svg>`
}

type IconProps = {
  icon: string
  size?: number
  color?: string
}

export function Icon({ icon, size = 20, color = '#64748b' }: IconProps) {
  const xml = useMemo(() => {
    const data = ICONIFY_ICONS[icon as keyof typeof ICONIFY_ICONS]
    if (!data) {
      return null
    }
    return buildSvgXml(data, size, color)
  }, [icon, size, color])

  if (!xml) {
    if (__DEV__) {
      console.warn(`[Icon] "${icon}" missing — run: npm run sync-icons`)
    }
    return null
  }

  return (
    <View pointerEvents="none">
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  )
}
