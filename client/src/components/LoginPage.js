import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Attempting login to:', `${process.env.REACT_APP_API_URL || 'https://ctf-001.onrender.com'}/api/login`);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://ctf-001.onrender.com'}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/story');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h1>Login Page</h1>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Let's save the islands!!</button>
        </form>
    </div>
  );
}

export default LoginPage;