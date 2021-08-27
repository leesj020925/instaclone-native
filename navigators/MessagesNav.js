import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack'
import Room from '../screens/Room'
import Rooms from '../screens/Rooms'

const Stack = createStackNavigator()

export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: 'black',
        },
      }}
    >
      <Stack.Screen
        name="Rooms"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-down" size={28} />
          ),
        }}
        component={Rooms}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  )
}
