import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Image } from 'react-native'
import Comments from '../screens/Comments'
import Feed from '../screens/Feed'
import Likes from '../screens/Likes'
import Me from '../screens/Me'
import Notifications from '../screens/Notifications'
import Photo from '../screens/Photo'
import Profile from '../screens/Profile'
import Search from '../screens/Search'

const Stack = createStackNavigator()

export default function SharedStackNav({ screenName }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'black' },
      }}
    >
      {screenName === 'Feed' ? (
        <Stack.Screen
          name="Feed_route"
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                style={{ maxHeight: 100, width: 200, marginLeft: 70 }}
                resizeMode="contain"
                source={require('../assets/logo.png')}
              />
            ),
          }}
        />
      ) : null}
      {screenName === 'Search' ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === 'Notifications' ? (
        <Stack.Screen name="Notifications" component={Notifications} />
      ) : null}
      {screenName === 'Me' ? <Stack.Screen name="Me" component={Me} /> : null}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  )
}
