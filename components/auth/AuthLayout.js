import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import styled from 'styled-components/native'
import DismissKeyboard from '../DismissKeyboard'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 40px;
`
const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`

export default function AuthLayout({ children }) {
  return (
    <DismissKeyboard>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: '100%',
          }}
          behavior="contain"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
        >
          <Logo source={require('../../assets/logo.png')} />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  )
}
