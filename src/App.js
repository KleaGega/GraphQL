// src/App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import User from './User';

function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>React GraphQL Sample App</h1>
          <User />
        </div>
      </ApolloProvider>
  );
}

export default App;
