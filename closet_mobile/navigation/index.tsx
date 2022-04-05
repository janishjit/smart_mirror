/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import Closet from '../screens/ClosetScreen';
import CameraScreen from '../screens/CameraScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={ LinkingConfiguration }
      theme={ colorScheme === 'dark' ? DarkTheme : DefaultTheme }>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={ BottomTabNavigator } options={ { headerShown: false } } />
      <Stack.Screen name="NotFound" component={ NotFoundScreen } options={ { title: 'Oops!' } } />
      <Stack.Group screenOptions={ { presentation: 'modal' } }>
        <Stack.Screen name="Modal" options={ { title: "Clothing Options" } } component={ ModalScreen } />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F0E5D0';

  return (
    <BottomTab.Navigator
      initialRouteName="Closet"
      screenOptions={ {
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          backgroundColor: bgColor,
        },
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
      } }>
      <BottomTab.Screen
        name="Closet"
        component={ Closet }
        options={ ({ navigation }: RootTabScreenProps<'Closet'>) => ({
          title: "My Closet",
          tabBarIcon: ({ color }) => <TabBarIcon name="tshirt" color={ color } />,
          headerStyle: {
            backgroundColor: bgColor,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          },
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
          }
        }) }
      />
      <BottomTab.Screen
        name="Camera"
        component={ CameraScreen }
        options={ {
          headerShown: false,
          title: 'Camera',
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={ color } />,
        } }
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
}) {
  return <FontAwesome5 size={ 30 } style={ { marginBottom: -3 } } { ...props } />;
}
