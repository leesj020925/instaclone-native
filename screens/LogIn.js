import { gql, useMutation } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { isLoggedInVar, logUserIn } from '../apollo'
import AuthButton from '../components/auth/AuthButton'
import AuthLayout from '../components/auth/AuthLayout'
import { TextInput } from '../components/auth/AuthShared'

const LOG_IN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(userName: $username, password: $password) {
      ok
      token
      error
    }
  }
`

export default function LogIn({ route: { params } }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  })
  const passwordRef = useRef()
  const onCompleted = async (data) => {
    const {
      login: { ok, token },
    } = data
    console.log(ok, token)
    if (ok) {
      await logUserIn(token)
    }
  }
  const [loginMutation, { loading }] = useMutation(LOG_IN_MUTATION, {
    onCompleted,
  })
  const onNext = (nextOne) => {
    nextOne?.current?.focus()
  }
  const onValid = (data) => {
    if (!loading) {
      loginMutation({
        variables: {
          ...data,
        },
      })
    }
  }
  useEffect(() => {
    register('username', {
      required: true,
    })
    register('password', {
      required: true,
    })
  }, [register])
  return (
    <AuthLayout>
      <TextInput
        value={watch('username')}
        placeholder="Username"
        returnKeyType="next"
        autoCapitalize="none"
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue('username', text)}
      />
      <TextInput
        value={watch('password')}
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text) => setValue('password', text)}
      />
      <AuthButton
        text="Log In"
        loading={loading}
        disabled={!watch('username') || !watch('password')}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  )
}
