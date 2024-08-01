import { useState } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8002/api/Users/Login.php', {
                username,
                password
            });

            if (response.data.success) {
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userName', response.data.name);
                const redirectPath = response.data.role === 'admin' ? '/admin' : '/';
                window.location.href = redirectPath;
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };
   
    return (
        <>
            <Navigation />
            <div className='monster-formulaire'>
                <form onSubmit={handleLogin} className='connection'>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </>
    );
};

export default Login;
