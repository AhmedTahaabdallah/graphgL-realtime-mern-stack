import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider, 
  split,
  HttpLink,
  from
} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/authContext';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import Profile from './pages/auth/Profile';
import Post from './pages/post/Post';
import PasswordForgot from './pages/auth/PasswordForgot';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import { removeKey } from './helpers/utils';
import Users from './pages/Users';
import SingleUser from './pages/SingleUser';
import PostUpdate from './pages/post/PostUpdate';
import SinglePost from './pages/post/SinglePost';
import './index.css';
import SearchResults from './components/SearchResults';

const App = () =>{
  const { state } = useContext(AuthContext);
  const { user } = state;

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {        
        if (graphQLErrors[0].status === 401) {
          /// logout
          // console.log('logout');
        }
    }

    if (networkError) {
        // handle network error
        console.log(networkError);
    }
  });

  const httpLink = new HttpLink({ 
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    headers: {
      Authorization: user ? `Bearer ${user.token}` : ''
    }
  });

  const wsLink = new GraphQLWsLink(createClient({
    url: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const appLink = from([
    errorLink, splitLink
])

  const client = new ApolloClient({
    //uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache({
      //addTypename: false, 
      typePolicies: {
        User: {
          fields: {
            images: {
              merge(existing, incoming) {
                let newExisting = [];
                // if (existing && existing.length > 0) {
                //   for (let i = 0; i < existing.length; i++) {
                //     const element = existing[i];
                //     const newElement = removeKey(element, '__typename');
                //     newExisting.push(newElement);
                //   }
                // }
                let newIncoming = [];
                if (incoming && incoming.length > 0) {
                  for (let i = 0; i < incoming.length; i++) {
                    const element = incoming[i];
                    
                    const newElement = removeKey(element, '__typename');                    
                    newIncoming.push(newElement);
                  }
                }
                return newExisting.concat(newIncoming);
              },
            },
          },
        },
      },
    }),
    link: appLink,
    // headers: {
    //   Authorization: user ? `Bearer ${user.token}` : ''
    // }
  });

  return (
    <ApolloProvider client={client}>
      <main style={{paddingTop: '70px'}}>
        <ToastContainer />
        <Nav/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/user/:userName' element={<SingleUser />} />
          <Route path='/search' element={<SearchResults />} />
          <Route exact path='/post/:postId' element={<SinglePost />} />
          <Route exact path='/login' element={<PublicRoute />} >
            <Route exact path='/login' element={<Login />} />
          </Route>
          <Route exact path='/register' element={<PublicRoute />} >
            <Route exact path='/register' element={<Register />} />
          </Route>
          <Route exact path='/complete-registration' element={<PublicRoute />} >
            <Route exact path='/complete-registration' element={<CompleteRegistration />} />
          </Route>
          <Route path='/password/forgot' element={<PasswordForgot />} />
          <Route exact path='/password/update' element={<PrivateRoute path='/login' />} >
            <Route exact path='/password/update' element={<PasswordUpdate />} />
          </Route>
          <Route exact path='/profile' element={<PrivateRoute path='/login' />} >
            <Route exact path='/profile' element={<Profile />} />
          </Route>
          <Route exact path='/post/create' element={<PrivateRoute path='/login' />} >
            <Route exact path='/post/create' element={<Post />} />
          </Route>
          <Route exact path='/post/update' element={<PrivateRoute path='/login' />} >
            <Route exact path='/post/update/:postId' element={<PostUpdate />} />
          </Route>
        </Routes>               
      </main> 
    </ApolloProvider>
  );
}

export default App;
