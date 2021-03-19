
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { handleGoogleSignIn, initializeLoginFrameWork, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';


function Login() {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false
    })

    initializeLoginFrameWork();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const fbSignIn = () => {
        handleFbSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const signOut = () => {
        handleSignOut()
            .then(res => {
                handleResponse(res, false);
            })
    }

    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if (redirect) {
            history.replace(from);
        }
    }

    const handleBlur = (event) => {
        let isFormedValid = true;
        if (event.target.name === "email") {
            isFormedValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === "password") {
            const isPasswordValid = event.target.value.length > 7;
            const passwordHasNumber = /\d{1}/.test(event.target.value);
            isFormedValid = isPasswordValid && passwordHasNumber;
        }
        if (isFormedValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }

    const handleSubmit = (event) => {
        if (newUser && user.email && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                    // console.log(res)
                })
        }

        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    // console.log(res)
                    handleResponse(res, true);
                })
        }

        event.preventDefault();
    }



    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn ? <button onClick={signOut}>Sign out</button> : <button onClick={googleSignIn}>Sign in</button>
            }
            <br />
            <button onClick={fbSignIn}>Sign in using facebook</button>
            {
                user.isSignedIn && <div>
                    <p>Welcome, {user.name}</p>
                    <p>Your email: {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }

            <h1>Our Own Authentication</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" />
            <label htmlFor="newUser">New User Sign Up</label>
            <form onSubmit={handleSubmit}>
                {newUser && <input type="text" onBlur={handleBlur} placeholder="Enter Your Name" name="name" />}
                <br />
                <input type="text" onBlur={handleBlur} name="email" placeholder="Enter Your Email" required />
                <br />
                <input type="password" onBlur={handleBlur} name="password" placeholder="Enter Your Password" required />
                <br />
                <input type="submit" value={newUser ? 'sign up' : 'sign in'} />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'logged in'} successful</p>
            }
        </div>
    );
}

export default Login;
