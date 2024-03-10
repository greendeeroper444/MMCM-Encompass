import './App.css'
import {Routes, Route, useNavigate} from 'react-router-dom'
import SigninPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import CapstoneDetailsPage from './pages/CapstoneDetailsPage'
import UploadDataPage from './pages/UploadCapstonePage'
import { useAuth } from '../contexts/authContext'
import AboutPage from './pages/AboutPage'
import FaqsPage from './pages/FaqsPage'
import ViewProfilePage from './pages/ViewProfilePage'
import DashboardPage from './pages/DashboardPage'
import UpdateCapstonePage from './pages/UpdateCapstonePage'
import { useEffect } from 'react'

  axios.defaults.baseURL = 'http://localhost:8080';
  axios.defaults.withCredentials = true

function App() {

  const {user, admin, isLoading} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!(user || admin)){
      navigate('/', { replace: true });
    }
  }, [user, admin, navigate]);

  if(isLoading){
    return <div>Loading...</div>;
  }


  return (
    <div>
      <Toaster position='center-top' toastOptions={{
        className: '',
        style: {
          border: '1px solid rgb(255, 8, 0)',
          boxShadow: '0 0 0.2rem rgba(255, 38, 0, 0.5)',
          padding: '10px',
          color: '#713200',
        },
      }}
        containerStyle={{
          top: 100,
        }}
      />
      <Routes>
        <Route path="/" element={<SigninPage />} />
        {
          (user || admin) && (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/upload-capstone" element={<UploadDataPage />} />
              <Route path='/capstone-details/:capstoneId' element={<CapstoneDetailsPage />} />
              <Route path="/view-profile" element={<ViewProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/update-capstone/:capstoneId" element={<UpdateCapstonePage />} />
            </>
          )
        }
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
      </Routes>
    </div>
  )
}

export default App
