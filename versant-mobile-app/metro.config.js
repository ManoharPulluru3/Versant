const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withNativeWind } = require('nativewind/metro')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '..')

const nativeBuildBlockList = [
  /[/\\]\.cxx[/\\].*/,
  /[/\\]android[/\\]build[/\\].*/,
  /[/\\]android[/\\]\.gradle[/\\].*/,
  /[/\\]ios[/\\]build[/\\].*/,
]

const config = mergeConfig(getDefaultConfig(__dirname), {
  watchFolders: [projectRoot],
  resolver: {
    blockList: [
      ...nativeBuildBlockList,
      new RegExp(
        `${monorepoRoot.replace(/[/\\]/g, '[/\\\\]')}/\\.tools/.*`,
      ),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
})

module.exports = withNativeWind(config, { input: './global.css' })
