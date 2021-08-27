import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../colors'
import AuthButton from '../components/auth/AuthButton'
import AuthLayout from '../components/auth/AuthLayout'

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 20px;
`
const LoginLinkCon = styled.TouchableOpacity`
  margin: 0 auto;
`

export default function Welcome({ navigation }) {
  const goToCreateAccount = () => navigation.navigate('CreateAccount')
  const goToLogIn = () => navigation.navigate('LogIn')
  return (
    <AuthLayout>
      <AuthButton
        text="Create New Account"
        disabled={false}
        onPress={goToCreateAccount}
      />
      <LoginLinkCon onPress={goToLogIn}>
        <LoginLink>Log in</LoginLink>
      </LoginLinkCon>
    </AuthLayout>
  )
}
