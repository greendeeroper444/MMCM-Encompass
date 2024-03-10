import React, { useContext } from 'react'
import CustomNavbar from '../components/CustomNavbar'
import { AuthContext } from '../../contexts/authContext';
import adminIcon from '../assets/admin-image.png';

export default function ViewProfilePage() {
    const {user, admin} = useContext(AuthContext);
  return (
    <>
    <CustomNavbar />
    <br /><br /><br /><br />
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Profile</h1>
                    <div className="text-center">
                        {
                            user && !admin && (
                                <>
                                    {
                                        user.image && <img src={user.image}
                                        alt="User Avatar" 
                                        className="rounded-circle mb-3" 
                                        style={{ width: '150px', height: '150px' }} 
                                        />
                                    }
                                    <h2>{user.name}</h2>
                                    <p>Email: {user.email}</p>
                                </>
                            )
                        }
                        {
                            admin && (
                                <>
                                    <img src={adminIcon} alt="Admin Avatar" className="mb-3" style={{ width: '150px', height: '150px' }} />
                                    <h2>User Name: {admin.username}</h2>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
