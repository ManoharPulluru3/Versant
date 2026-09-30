const generated = require('./iconify.icons.generated.json')

const iconifyIcons = Array.isArray(generated?.icons) ? generated.icons : []

module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    ['react-native-iconify/babel', { icons: iconifyIcons }],
    'react-native-reanimated/plugin',
  ],
}
