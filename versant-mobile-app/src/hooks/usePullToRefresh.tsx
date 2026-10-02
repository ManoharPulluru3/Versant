import { useCallback, useState } from 'react'
import { RefreshControl } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export function usePullToRefresh(reload: () => Promise<unknown>) {
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    Promise.resolve()
      .then(reload)
      .catch(() => undefined)
      .finally(() => setRefreshing(false))
  }, [reload])

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.brand}
      colors={[colors.brand]}
      progressBackgroundColor={colors.card}
    />
  )
}

export async function noReload() {}
