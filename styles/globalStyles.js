import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 4,
    backgroundColor: colors.backgroundPrimary,
    alignItems: 'center',
  },
  screenContainerScroll: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 8,
    backgroundColor: colors.backgroundPrimary,
  },
  textBody: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  textBodyS: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  textBodyBold: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  textBodyError: {
    fontFamily: 'Montserrat-Regular',
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  textH1: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 32,
    marginBottom: 32,
  },
  textH2: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 24,
    marginBottom: 16,
  },
});

export default globalStyles;
