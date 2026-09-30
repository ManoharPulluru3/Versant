/**
 * @format
 */

import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { HomeScreen } from '../src/screens/HomeScreen'

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    darkMode: false,
    background: 'soft',
    colors: {
      canvas: '#F6F7F2',
      text: '#17221D',
      muted: '#7A837D',
      card: '#FFFFFF',
      cream: '#F2F5E8',
    },
  }),
}))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    }),
  }
})

test('home screen renders', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<HomeScreen />)
  })
})
