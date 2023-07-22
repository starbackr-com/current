import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SuccessToast, WarningToast } from "../components";
import { colors } from "../styles";

const useErrorToast = (errorMsg: string) => {
  const insets = useSafeAreaInsets();
  function trigger() {
    Toast.show(errorMsg, {
      duration: Toast.durations.SHORT,
      position: -insets.bottom - 25,
      backgroundColor: colors.primary500,
      textStyle: {fontFamily: 'Montserrat-Bold'}
    });
  }
  return trigger;
};

export default useErrorToast;
