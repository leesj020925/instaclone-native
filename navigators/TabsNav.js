import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feed from '../screens/Feed'
import Search from '../screens/Search'
import Notifications from '../screens/Notifications'
import { Image, View } from 'react-native'
import TabIcon from '../components/nav/TabIcon'
import Me from '../screens/Me'
import SharedStackNav from './SharedStackNav'
import useMe from '../hooks/useMe'

const Tabs = createBottomTabNavigator()

export default function TabsNav() {
  const { data } = useMe()
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'rgba(255, 255, 255, 0.3)',
        },
        tabBarActiveTintColor: 'white',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="Feed"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName="home" color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName="search" color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate('Upload')
            },
          }
        }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName="camera" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName="notifications" color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Me"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            data?.me?.avatar ? (
              <Image
                source={{ uri: data.me.avatar }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  ...(focused && { borderColor: 'white', borderWidth: 1 }),
                }}
              />
            ) : (
              <TabIcon iconName="person" color={color} focused={focused} />
            ),
        }}
      >
        {() => <SharedStackNav screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  )
}
