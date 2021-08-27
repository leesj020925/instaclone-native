import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SelectPhoto from '../screens/SelectPhoto'
import TakePhoto from '../screens/TakePhoto'
import { createStackNavigator } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function UploadNav() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarIndicatorStyle: { backgroundColor: 'white', top: 0 },
        tabBarStyle: { backgroundColor: 'black' },
      }}
    >
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTintColor: 'white',
              headerBackTitleVisible: false,
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={28} />
              ),
              headerStyle: {
                backgroundColor: 'black',
              },
            }}
          >
            <Stack.Screen
              name="Select_screen"
              options={{ title: 'Choose a Photo' }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  )
}
