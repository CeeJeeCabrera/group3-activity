import { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {

    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUpWithEmail = async () => {
        try {
            if(email.trim() === '' || password.trim() === ''){
                setErrorMessage('Email and password are required.');
                return;
            }

            await createUserWithEmailAndPassword(auth, email, password);

            setEmail('');
            setPassword('');
        } catch(errror) {
            if(error.code === 'auth/email-already-in-use') {
                setErrorMessage('Cannot create an account with this email. Please sign in.');
            } else {
                setErrorMessage('Failed to sign up.');
            }
        }

    }

    return (
        <div className="form">
            <h1>Sign Up</h1>
            <div className="error">{errorMessage}</div>
            <input
                type = 'email'
                placeholder = 'Email'
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            />
            <input
                type = 'password'
                placeholder = 'Password'
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />
            <button onClick={signUpWithEmail}>Sign Up</button>
        </div>
    );
}

export default SignUp;