// import {StyleSheet} from 'react-native';
// import {COLORS} from '../constants/colors';

// export const settingsStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   roundedContainer: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     marginTop: -20, // Overlap the gradient header.
//     padding: 16,
//   },
//   userCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     marginTop: -15,
//     marginBottom: 20,
//     padding: 16,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     width: '100%',
//     borderBottomColor: COLORS.greyTextSubtitle,
//     borderBottomWidth: 1,
//   },
//   userAvatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginLeft: 20,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.black,
//   },
//   userStatus: {
//     fontSize: 12,
//     color: COLORS.greyTextSubtitle,
//     fontWeight: '400',
//     marginTop: 4,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     padding: 14,
//     borderRadius: 12,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   iconBackground: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: COLORS.bubbleOwnGrey,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menuIcon: {
//     width: 24,
//     height: 24,
//     tintColor: COLORS.gradientEnd,
//   },
//   menuTitle: {
//     fontSize: 16,
//     color: COLORS.black,
//     fontWeight: '500',
//   },
//   menuSubtitle: {
//     fontSize: 12,
//     color: COLORS.greyTextSubtitle,
//     marginTop: 2,
//   },
// });

import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20, // Overlap the gradient header.
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginTop: -15,
    marginBottom: 20,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    borderBottomColor: COLORS.greyTextSubtitle,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  userStatus: {
    fontSize: 12,
    color: COLORS.greyTextSubtitle,
    fontWeight: '400',
    marginTop: 4,
  },
});
