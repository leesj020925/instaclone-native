import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { FlatList, KeyboardAvoidingView, Text, View } from 'react-native'
import ScreenLayout from '../components/ScreenLayout'
import styled from 'styled-components/native'
import { useForm } from 'react-hook-form'
import useMe from '../hooks/useMe'
import { Ionicons } from '@expo/vector-icons'

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        userName
        avatar
      }
      read
    }
  }
`

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`

const ROOM_QUERY = gql`
  query SeeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          userName
          avatar
        }
        read
      }
    }
  }
`
const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props) => (props.outGoing ? 'row-reverse' : 'row')};
  align-items: flex-end;
`
const Author = styled.View``
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 25px;
`
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden; /*if border-radius not work*/
  font-size: 16px;
  margin: 0px 10px;
`
const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
  width: 90%;
  margin-right: 10px;
`
const InputContainer = styled.View`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`
const SendButton = styled.TouchableOpacity``

export default function Room({ route, navigation }) {
  const { data: meData } = useMe()

  const { register, setValue, handleSubmit, getValues, watch } = useForm()
  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result
    if (ok && meData) {
      const { message } = getValues()
      setValue('message', '')
      const messageObj = {
        id,
        payload: message,
        user: {
          userName: meData.me.userName,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: 'Message',
      }
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              userName
              avatar
            }
            read
          }
        `,
        data: messageObj,
      })
      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment]
          },
        },
      })
    }
  }
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    },
  )

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  })
  const client = useApolloClient()
  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options
    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              userName
              avatar
            }
            read
          }
        `,
        data: message,
      })
      client.cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage) => aMessage.__ref === incomingMessage.__ref,
            )
            console.log(prev)
            console.log(incomingMessage)
            console.log(existingMessage)
            if (existingMessage) {
              return prev
            }
            return [...prev, incomingMessage]
          },
        },
      })
    }
  }
  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      })
    }
  }, [data])
  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      })
    }
  }
  useEffect(() => {
    register('message', { required: true })
  }, [register])
  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.userName}`,
    })
  }, [])
  const renderItem = ({ item: message }) => (
    <MessageContainer
      outGoing={message.user.userName !== route?.params?.talkingTo?.userName}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  )
  const messages = [...(data?.seeRoom?.messages ?? [])]
  messages.reverse()
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScreenLayout loading={loading}>
        <FlatList
          style={{ width: '100%', marginVertical: 10 }}
          inverted
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(message) => '' + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            placeholder="write"
            placeholderTextColor="rgba(255, 255, 255 ,0.5)"
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onChangeText={(text) => setValue('message', text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch('message')}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch('message'))}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch('message'))
                  ? 'rgba(255, 255, 255, 0.5)'
                  : 'white'
              }
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  )
}
