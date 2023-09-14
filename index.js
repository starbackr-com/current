import { registerRootComponent } from 'expo';
import ViewReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Realm from "realm";
Realm.flags.THROW_ON_GLOBAL_REALM = true

ViewReactNativeStyleAttributes.scaleY = true;

import App from './App';
import "react-native-get-random-values";
import 'big-integer'


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
