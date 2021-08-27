import { gql, useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native'
import styled from 'styled-components/native'
import DismissKeyboard from '../components/DismissKeyboard'

const SEARCH_PHOTOS = gql`
  query SearchPhotos($keyword: String!, $page: Int!) {
    searchPhotos(keyword: $keyword, page: $page) {
      id
      file
    }
  }
`

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const MessageText = styled.Text`
  margin-top: 10px;
  color: white;
  font-weight: bold;
`

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  width: ${(props) => props.width / 1.5}px;
  padding: 5px 10px;
  border-radius: 10px;
`

export default function Search({ navigation }) {
  const numColumns = 4
  const { width } = useWindowDimensions()
  const { setValue, register, watch, handleSubmit } = useForm()
  const [startQueryFn, { loading, data, called, refetch }] = useLazyQuery(
    SEARCH_PHOTOS,
  )
  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
        page: 1,
      },
    })
  }
  console.log(data)
  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="rgba(0, 0, 0, 0.8)"
      placeholder="Search Photos"
      autoCapitalize="none"
      returnKeyLabel="search"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue('keyword', text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  )
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    })
    register('keyword', { required: true, minLength: 3 })
  }, [])
  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Photo', {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: 100 }}
      />
    </TouchableOpacity>
  )
  const refresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }
  const [refreshing, setRefreshing] = useState(false)
  return (
    <DismissKeyboard>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" color="white" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              refreshing={refreshing}
              onRefresh={refresh}
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => '' + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DismissKeyboard>
  )
}
