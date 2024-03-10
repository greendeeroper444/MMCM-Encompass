import React, { useEffect, useState } from 'react'
import CustomNavbar from '../components/CustomNavbar'
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';
import { faFilePdf, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [users, setUsers] = useState([]);
    const {darkMode} = useAuth();
    const [capstones, setCapstones] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [searchCapstoneQuery, setSearchCapstoneQuery] = useState('');


    // to display searched capstone
    useEffect(() => {
        const fetchCapstones = async() => {
            try {
            const response = await axios.get(`/admin/search-capstone-list?q=${searchCapstoneQuery}`);
            setCapstones(response.data);
            } catch (error) {
            console.error(error);
            }
        };
    
        fetchCapstones();
    }, [searchCapstoneQuery]);

    // to search capstone in the list
    const handleSearchCapstone = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/admin/search-capstone-list?q=${searchUserQuery}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    // to display searched user
    useEffect(() => {
        const fetchUsers = async() => {
            try {
            const response = await axios.get(`/admin/search-user-list?q=${searchUserQuery}`);
            setUsers(response.data);
            } catch (error) {
            console.error(error);
            }
        };
    
        fetchUsers();
    }, [searchUserQuery]);

    // to search user in the list
    const handleSearchUser = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/admin/search-user-list?q=${searchUserQuery}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    //for capstone delete
    const handleDeleteCapstone = async(capstoneId) => {
        try {
            const response = await axios.delete(`/admin/delete-capstone/${capstoneId}`);
            if(response.data.error){
                console.error(response.data.error);
            } else{
                setCapstones((prevCapstones) => prevCapstones.filter((capstone) => capstone._id !== capstoneId));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    //for user delete
    const handleDeleteUser = async(userId) => {
        try {
            const response = await axios.delete(`/admin/delete-user/${userId}`);
            if(response.data.error){
                console.error(response.data.error);
            } else{
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    //display all users
    useEffect(() => {
        
        axios.get('/admin/get-allUsers')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

            axios.get('/admin/get-allCapstones')
            .then(response => {
                setCapstones(response.data);
            })
            .catch(error => {
                console.error('Error fetching capstones:', error);
            });
    }, []);

    //to show pdf
    const showPdf = (pdf) => {
        window.open(`${pdf}`, "_blank", "noreferrer");
    }

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirmation(true);
    };
    
  return (
    <>
    <CustomNavbar />
        <div className="container" style={{ marginTop: '100px' }}>
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            {
                showDeleteConfirmation && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                        <div className="modal-dialog" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation</h5>
                                    <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0',
                                        fontSize: '1.5rem',
                                        color: '#000'
                                    }} >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>

                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>No</button>
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        if(itemToDelete){
                                            if (itemToDelete.type === 'user'){
                                                handleDeleteUser(itemToDelete.id);
                                            } else if(itemToDelete.type === 'capstone'){
                                                handleDeleteCapstone(itemToDelete.id);
                                            }
                                        }
                                        setShowDeleteConfirmation(false)
                                    }}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <br />
            <br />


            {/* Search feature for user and email */}
            <div>
                <h4 className="mb-4">Student List</h4>
                <form onSubmit={handleSearchUser} className="form-list">
                    <input
                    type="text"
                    className="form-control rounded-start search-list"
                    placeholder="Search by name or email"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)} />
                </form>
            </div>
            <br />

            {/* User List */}
            {
                users.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <p>No student found</p>
                    </div>
                ) : (
                    <div className='table-responsive' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <table className={`table ${darkMode ? ' dark-mode' : ''}`}>
                            <thead>
                                <tr>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Picture</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Name</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Email</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user._id}>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>
                                                {
                                                    user.image && <img src={user.image} 
                                                    alt="User Avatar" 
                                                    className="rounded-circle mb-3" 
                                                    style={{ width: '40px', height: '40px' }} />
                                                }
                                            </td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>{user.name}</td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>{user.email}</td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>
                                                <button className='btn btn-danger' 
                                                onClick={() => confirmDelete({ id: user._id, type: 'user' })}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            <br />
            <br />
            <br />

            {/* capston search features */}
            <div>
                <h4 className="mb-4">Capstone List</h4>
                <form onSubmit={handleSearchCapstone} className="form-list">
                    <input
                    type="text"
                    className="form-control rounded-start search-list"
                    placeholder="Search by title or author"
                    value={searchCapstoneQuery}
                    onChange={(e) => setSearchCapstoneQuery(e.target.value)} />
                </form>
            </div>
            <br />

            {/* Capstone List */}
            {
                capstones.length === 0 ?(
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <p>No capstone found</p>
                    </div>
                ) : (
                    <div className='table-responsive' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <Link to={'/upload-capstone'} className='btn btn-success'>Upload Capstone</Link>
                        <table className={`table ${darkMode ? ' dark-mode' : ''}`}>
                            <thead>
                                <tr>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Title</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Description</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Author</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>File</th>
                                    <th className={`${darkMode ? ' dark-mode' : ''}`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    capstones.map(capstone => (
                                        <tr key={capstone._id}>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>{capstone.title}</td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>{capstone.description}</td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>{capstone.author}</td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`} 
                                            onClick={() => showPdf(capstone.pdf)}
                                            style={{ cursor: 'pointer' }} >
                                                <FontAwesomeIcon icon={faFilePdf} className="mr-2" style={{ color: "red" }} /> 
                                                {' '} {capstone.pdf.split('/').pop()}
                                            </td>
                                            <td className={`${darkMode ? ' dark-mode' : ''}`}>
                                                <Link className='btn btn-warning' to={`/update-capstone/${capstone._id}`}>Update</Link>
                                                {' '}
                                                <button className='btn btn-danger' 
                                                onClick={() => confirmDelete({ id: capstone._id, type: 'capstone' })}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            <br />
            <br />
            <br />
        </div>
    </>
  )
}
