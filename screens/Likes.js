import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client/core'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { useState } from 'react/cjs/react.development'
import ScreenLayout from '../components/ScreenLayout'
import UserRow from '../components/UserRow'
import { USER_FRAGMENT } from '../fragments'

const LIKES_QUERY = gql`
  query SeePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`
export default function Likes({ route, navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const { data, loading, refetch } = useQuery(LIKES_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  })
  const renderUser = ({ item: user }) => <UserRow {...user} />
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          ></View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data?.seePhotoLikes}
        keyExtractor={(item) => '' + item.id}
        renderItem={renderUser}
        style={{ width: '100%' }}
      />
    </ScreenLayout>
  )
}
