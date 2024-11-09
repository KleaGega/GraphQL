// src/ApolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://graphqlzero.almansi.me/api', // GraphQL endpoint
    cache: new InMemoryCache(),
});

export default client;
