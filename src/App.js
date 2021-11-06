import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from "./firebase.config";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState } from 'react';
initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn : false,
    photo : '',
    email : ''
  });
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
  .then((result) => {
    GoogleAuthProvider.credentialFromResult(result);
    const {displayName, email, photoURL} = result.user;
    const signedInUser = {
      isSignedIn : true,
     name: displayName,
     photo : photoURL,
     email : email
    }
    setUser(signedInUser);
  }).catch((error) => {
   GoogleAuthProvider.credentialFromError(error);
  });
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      alert("are you sure?")
      const userSignedOut = {
        isSignedIn : false,
      }
      setUser(userSignedOut);
    }).catch((error) => {
      console.log(error.message)
    });
  }
  const {name, photo, email, isSignedIn} = user;
  return (
    <div className="App">
     <h1>Hello World! I am back</h1>
     {
       isSignedIn ? <div>
       <h2>Welcome {name}</h2>
       <img src={photo} alt="" />
       <h3>Email : {email}</h3>
       <button onClick={handleSignOut}>Sign Out</button>
       </div>
       : <button onClick={handleSignIn}>Sign In</button>
     }
     
    </div>
  );
}

export default App;
