import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useEffect } from 'react/cjs/react.development'
import styled from 'styled-components/native'
import { colors } from '../colors'
import DismissKeyboard from '../components/DismissKeyboard'
import { FEED_PHOTO } from '../fragments'
import { ReactNativeFile } from 'apollo-upload-client'

const UPLOAD_PHOTO_MUTATION = gql`
  mutation UploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`
const Photo = styled.Image`
  height: 350px;
`
const CaptionContainer = styled.View`
  margin-top: 30px;
`
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`
const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 20px;
  font-weight: bold;
  margin-right: 7px;
`

export default function UploadForm({ route, navigation }) {
  const updateUploadPhoto = (cache, result) => {
    const {
      data: { uploadPhoto },
    } = result
    if (uploadPhoto.id) {
      cache.modify({
        id: `ROOT_QUERY`,
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev]
          },
        },
      })
    }
    // navigation.goBack()
    // navigation.goBack()
    navigation.navigate('Tabs')
  }
  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updateUploadPhoto,
    },
  )
  const { register, handleSubmit, setValue } = useForm()
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  )
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  )
  useEffect(() => {
    register('caption')
  }, [register])
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    })
  }, [])
  const onValid = ({ caption }) => {
    const file = new ReactNativeFile({
      uri: route.params.file,
      name: `${Date.now()}.jpg`,
      type: 'image/jpeg',
    })
    uploadPhotoMutation({
      variables: {
        caption,
        file: file,
      },
    })
  }
  return (
    <DismissKeyboard>
      <Container>
        <Photo resizeMode="contain" source={{ uri: route.params.file }} />
        <CaptionContainer>
          <Caption
            returnKeyType="done"
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0 ,0 ,0 ,0.5)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text) => setValue('caption', text)}
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  )
}
