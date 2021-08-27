import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import {
  getMainDefinition,
  offsetLimitPagination,
} from '@apollo/client/utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws'

export const isLoggedInVar = makeVar(false)
export const tokenVar = makeVar('')

const TOKEN = 'token'

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(JSON.stringify(TOKEN), JSON.stringify(token))
  isLoggedInVar(true)
  tokenVar(token)
}

const httpLink = createHttpLink({
  uri: 'https://tall-kangaroo-64.loca.lt/graphql',
})

const uploadHttpLink = createUploadLink({
  uri: 'https://perfect-rabbit-64.loca.lt/graphql',
})

const wsLink = new WebSocketLink({
  uri: 'ws://perfect-rabbit-64.loca.lt/graphql',
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  }
})
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`graphQLErrors`, graphQLErrors)
  }
  if (networkError) {
    console.log(`networkError`, networkError)
  }
})
const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLinks,
)

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN)
  isLoggedInVar(false)
  tokenVar(null)
}

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
})

const client = new ApolloClient({
  link: splitLink,
  cache,
})
export default client
