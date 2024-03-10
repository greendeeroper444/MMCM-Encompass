import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import logo from '../assets/icon-mmcm.png';
import googleImage from '../assets/google.png'
import { useAuth } from '../../contexts/authContext';

export default function LoginPage() {
    const {setAdmin,darkMode} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
        showPassword: false
    });
    
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { username, password } = data;
            const response = await axios.post('/admin/login', {
                username,
                password
            });
            if(response.data.error){
                toast.error(response.data.error);
            } else{
                //Reset form fields individually
                setData({
                    username: '',
                    password: ''
                });
                setAdmin(response.data.admin);
                navigate('/home');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred during login. Please try again later.');
        }
    };


    const googleAuth = () => {
        window.open(
            'http://localhost:8080/auth/google',
            "_self"
        );
    };


    const handleTogglePassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };

  return (
    <div className='container mt-5'>
        <div className='row'>
            <div className='col-md-6 mt-5'>
                <div className="logo-container">
                    <img src={logo} alt="Mapúa Malayan Colleges Mindanao" className="logo" />
                    <div className="welcome-heading">
                        <h2 className="text-center">Welcome to</h2>
                        <h1 className="text-center mb-4">Mapúa Malayan Colleges Mindanao</h1>
                        <h5 className="text-center">EnCompass: An Online Library and References for Capstone Research Project</h5>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <Card className='login-card mt-5'>
                    <Card.Body className={`${darkMode ? ' dark-mode' : ''}`}>
                        <Card.Title><h2>Sign in</h2></Card.Title>
                        <form onSubmit={handleLogin}>
                            <div className={`form-group mt-4 ${darkMode ? ' dark-mode' : ''}`}>
                                <label htmlFor="username">Username</label>
                                <input
                                type="text"
                                className={`form-control mt-2 orange-hover ${darkMode ? ' dark-mode' : ''}`}
                                id="username"
                                value={data.username}
                                onChange={(e) => setData({ ...data, username: e.target.value })}
                                autoComplete='off'
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-container">
                                    <input
                                    type={data.showPassword ? "text" : "password"}
                                    className={`form-control mt-2 orange-hover ${darkMode ? ' dark-mode' : ''}`}
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />

                                    <label className="password-toggle-label">
                                        <input
                                        type="checkbox"
                                        className="password-toggle-checkbox"
                                        checked={data.showPassword}
                                        onChange={handleTogglePassword}
                                        />
                                        Show Password
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className={`orange-button mt-4 ${darkMode ? ' dark-mode-button' : ''}`}>Login</button>
                        </form>
                        <div className="mt-3 text-center">
                            <hr className="divider" />
                            <span className="divider-text">Sign in using one of your MCM Account</span>
                            <hr className="divider" />
                        </div>
                        <div className="mt-3">
                            <button className={`mmcm--account ${darkMode ? ' darkmode--mmcm--account' : ''}`} onClick={googleAuth}>
                                <img src={googleImage} alt="Google" className="google-icon" /> MCM Account
                            </button>
                        </div>

                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>
  )
}