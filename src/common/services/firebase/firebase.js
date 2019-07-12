import * as firebase from 'firebase/app';

import 'firebase/auth';

export const init = () => {
  // Note this object contains unique, but non-secret identifiers.
  var firebaseConfig = {
    apiKey: 'AIzaSyDPe1F4lsCVALqEsfDXLRH3FolSU46p5Lw',
    authDomain: 'inquestsca.firebaseapp.com',
    databaseURL: 'https://inquestsca.firebaseio.com',
    projectId: 'inquestsca',
    storageBucket: '',
    messagingSenderId: '333226893223',
    appId: '1:333226893223:web:b74734e6265833c7'
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
};

const authenticationResult = (user, errorCode) => ({ user, errorCode });

export const signIn = (email, password) => {
  // TODO: use async await syntax.
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => authenticationResult(user, null))
    .catch(error => authenticationResult(null, error.code));
};

export const signUp = (email, password) => {
  // TODO: use async await syntax.
  // TODO: consider using Firebase Admin SDK to handle account creation.
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => authenticationResult(user, null))
    .catch(error => authenticationResult(null, error.code));
};

export const isUserSignedIn = () => firebase.auth().currentUser !== null;

export const fetchWithAuthentication = async (url, options) => {
  if (!isUserSignedIn())
    throw new Error('No user is signed in, cannot authenticate request.');

  const token = await firebase.auth().currentUser.getIdToken();
  // TODO: determine what options to set here.
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    },
    credentials: 'same-origin'
  });
  return response;
};
