import {useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../constants/types';
import {useAppSelector} from '../../hooks/useStore';
import {
  DEFAULT_USER_NAME,
  DEFAULT_USER_STATUS,
  SETTINGS_MENU_ITEMS,
} from '../../constants/appConstants';

export const useSettings = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {user} = useAppSelector(state => state.auth);

  const nameToDisplay = user?.displayName || DEFAULT_USER_NAME;
  const statusToDisplay = user?.status || DEFAULT_USER_STATUS;

  // Use useMemo to avoid re-creation on every render if needed.
  const settingsMenuItems = useMemo(() => SETTINGS_MENU_ITEMS, []);

  return {
    navigation,
    user,
    nameToDisplay,
    statusToDisplay,
    settingsMenuItems,
  };
};
