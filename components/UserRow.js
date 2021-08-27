import { gql, useMutation } from '@apollo/client'
import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../colors'
import { useNavigation } from '@react-navigation/core'

const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userName: String!) {
    followUser(userName: $userName) {
      ok
      error
    }
  }
`
const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userName: String!) {
    unfollowUser(userName: $userName) {
      ok
      error
    }
  }
`
const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
`

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`
const Username = styled.Text`
  font-weight: bold;
  color: white;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const FollowBtn = styled.TouchableOpacity`
  margin-right: 50px;
  background-color: ${colors.blue};
  padding: 10px;
  border-radius: 7px;
`
const FollowBtnText = styled.Text`
  color: white;
`

export default function UserRow({ id, userName, avatar, isFollowing, isMe }) {
  const navigation = useNavigation()
  console.log(isFollowing)
  const followUpdate = (cache, data) => {
    console.log('data : ', data)
    const {
      data: {
        followUser: { ok },
      },
    } = data
    if (ok) {
      cache.modify({
        id: `User:${id}`,
        fields: {
          isFollowing(prev) {
            console.log('prev: ', prev)
            return true
          },
        },
      })
    }
  }
  const unfollowUpdate = (cache, data) => {
    console.log('data : ', data)
    const {
      data: {
        unfollowUser: { ok },
      },
    } = data
    if (ok) {
      cache.modify({
        id: `User:${id}`,
        fields: {
          isFollowing(prev) {
            return false
          },
        },
      })
    }
  }
  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION, {
    update: followUpdate,
  })
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER_MUTATION, {
    update: unfollowUpdate,
  })
  const onFollowPress = () => {
    followUserMutation({
      variables: {
        userName,
      },
    })
  }
  const onUnfollowPress = () => {
    unfollowUserMutation({
      variables: {
        userName,
      },
    })
  }
  return (
    <Wrapper>
      <Column
        onPress={() =>
          navigation.navigate('Profile', {
            id,
            userName,
          })
        }
      >
        <Avatar source={{ uri: avatar }} />
        <Username>{userName}</Username>
      </Column>
      {!isMe ? (
        <FollowBtn onPress={isFollowing ? onUnfollowPress : onFollowPress}>
          <FollowBtnText>{isFollowing ? 'Unfollow' : 'Follow'}</FollowBtnText>
        </FollowBtn>
      ) : null}
    </Wrapper>
  )
}
