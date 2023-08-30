import { RefreshControl } from "react-native-gesture-handler"
import { colors } from "../../../styles"

export const MyRefreshControl = ({
  refreshing,
  onRefresh,
  counter,
  ...props
}) => {
  return (
    <RefreshControl
      onRefresh={onRefresh}
      refreshing={refreshing}
      tintColor={colors.primary500}
      titleColor={colors.backgroundActive}
      {...props}
    />
  )
}