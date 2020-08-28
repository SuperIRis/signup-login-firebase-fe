import firebase from 'firebase/app';
import 'firebase/auth';

export function firebaseSignup({ email, password }) {
  console.log('hello I am firebase signup');
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      console.log('success in firebase auth', res);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('so sad...', error);

      // ...
    });
}
