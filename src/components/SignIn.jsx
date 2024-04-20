import { useState } from 'react';
import { auth, googleProvider } from '../configs/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

function SignIn() {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithEmail = async () => {
    try {
      setErrorMessage('');

      if (email.trim() === '' || password.trim() === '') {
        setErrorMessage('Email and password are required.');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Incorrect password. Please try again.');
      } else {
        setErrorMessage('Failed to sign in.');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Cannot create an account with this email. Please sign in.');
      } else {
        setErrorMessage('Failed to sign up.');
      }
    }
  }

  return (
    <div className='form'>
      <h1>Sign In</h1>
      <div className='error'>{errorMessage}</div>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signInWithEmail}>Sign In</button>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
}

export default SignIn;