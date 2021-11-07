import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from "./firebase.config";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { useState } from 'react';
initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn : false,
    name : '',
    photo : '',
    email : '',
    password : ''
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

  const handleBlur = (event) => {
    let isValid;
    if (event.target.name === 'email') {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value)
      isValid = isEmailValid;
    }
    if (event.target.name === 'password') {
      const isPassValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(event.target.value);
      isValid = isPassValid ;
    }
    if (event.target.name === 'name') {
      isValid = true ;
    }
    if (isValid) {
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      newUserInfo["isSignedIn"] = true;
      newUserInfo.name = event.target.value;
      setUser(newUserInfo);
      console.log(user)
    }
  }

  const handleSubmit = (event) => {
    if (user.isSignedIn) {
      createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    const signedUserInfo = userCredential.user;
    console.log(signedUserInfo);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode, errorMessage)
  });

    }
    event.preventDefault();
  }
  
  const handleLogIn = (event) => {
    signInWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    const loggedInUser = userCredential.user;
    const {name, password, email} = loggedInUser;
    setUser({
      isSignedIn : true,
     name: name,
     email : email,
     password : password
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode, errorMessage);
  });
  event.preventDefault();
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


     <form action="">
       <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
       <label htmlFor="">New User Sign Up</label>
       <br />
       {
         newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Your Name"/>
       }
       <br />
       <input onBlur={handleBlur} type="email" placeholder="Enter Your Email" name="email" required/>
       <br />
       <input onBlur={handleBlur} type="password" name="password" id="" placeholder="Enter your Password" required/>
       <br />
       {
         newUser ? <input onClick={handleSubmit} type="submit" value="Submit" />
         : <input type="submit" onClick={handleLogIn} value="Log-In" />
       }
       {
         user ? user.password && user.email ? <p>user {newUser ? "created" : "logged in"} successfully</p> : 
         <p style={{color: "red"}}>Something went wrong</p>
         : ''
       }

     </form>
     <h1>nodes</h1>
    </div>
  );
}

export default App;
