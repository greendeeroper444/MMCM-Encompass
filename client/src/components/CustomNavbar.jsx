import React, { useContext, useState } from 'react'
import { Button, Container, Dropdown, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faHome, faMoon, faQuestionCircle, faSignOutAlt, faTimes, faUpload, faUserCircle, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import navbarLogo from '../assets/icon-mmcm.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/authContext';

export default function CustomNavbar() {
    const {setUser, admin, setAdmin, darkMode, toggleMode} = useAuth();
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');
    const [showModal, setShowModal] = useState(false);

    


    const handleLinkClick = (path) => {
        setActiveLink(path);
        navigate(path); 
        
        localStorage.setItem('activeLink', path);
    
        //to remove active class from all links
        const links = document.querySelectorAll('.nav--link');
        links.forEach(link => link.classList.remove('active'));
    
        //to add active class to the clicked link
        const clickedLink = document.querySelector(`.nav--link[href='${path}']`);
        if(clickedLink){
            clickedLink.classList.add('active');
        }
    };
    
    
    const handleLogout = async () => {
        try {
            const response = await axios.post('/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            setAdmin(null);
            localStorage.removeItem('currentResults');
            localStorage.removeItem('searchPerformed');
            navigate('/');
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };


  return (
    <>
        <Navbar bg={darkMode ? 'dark' : 'light'} expand="lg" className='navbar'>
            <Container>
                <Navbar.Brand href="/home">
                    <img src={navbarLogo} alt="logo" className='logo-home' />
                </Navbar.Brand>
                <Navbar.Toggle className={`${darkMode ? ' menu' : ''}`} onClick={() => setShowSidebar(!showSidebar)} />
                <Navbar.Collapse id="responsive-navbar-nav" className='nav--link d-none d-lg-block'>
                    <Nav className="me-auto">
                        <Nav.Link className={`nav--link custom-link ${location.pathname === '/home' || activeLink === '/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/home')} style={{ marginLeft: '150px', color: darkMode ? '#fff' : '#000' }} > HOME</Nav.Link>
                        <Nav.Link className={`nav--link custom-link ${location.pathname === '/about' || activeLink === '/about' ? 'active' : ''}`} onClick={() => handleLinkClick('/about')} style={{ marginLeft: '20px', color: darkMode ? '#fff' : '#000' }} > ABOUT</Nav.Link>
                        <Nav.Link className={`nav--link custom-link ${location.pathname === '/faqs' || activeLink === '/faqs' ? 'active' : ''}`} onClick={() => handleLinkClick('/faqs')} style={{ marginLeft: '20px', color: darkMode ? '#fff' : '#000' }} > FAQS</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto">
                        <NavDropdown title="PROFILE" id="collapsible-nav-dropdown" className='profile'>
                            <NavDropdown.Item href="/view-profile" className='profile--attribute' >
                                <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> View Profile
                            </NavDropdown.Item>
                            {
                                admin && (
                                    <NavDropdown.Item href="/upload-capstone" className='profile--attribute' style={{ marginTop: '10px' }} >
                                        <FontAwesomeIcon icon={faUpload} className="mr-2" /> Upload Capstone
                                    </NavDropdown.Item>
                                )
                            }
                            {
                                admin && (
                                    <NavDropdown.Item href="/dashboard" className='profile--attribute' style={{ marginTop: '10px' }} >
                                        <FontAwesomeIcon icon={faDashboard} className="mr-2" /> Dashboard
                                    </NavDropdown.Item>
                                )
                            }
                            <NavDropdown.Item onClick={() => setShowModal(true)} className='profile--attribute' style={{ marginTop: '10px' }} >
                                <FontAwesomeIcon icon={faMoon} className="mr-2" /> Modes
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className='profile--attribute' >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className={`sidebar ${darkMode ? 'dark-mode' : ''} ${showSidebar ? 'show' : ''} d-lg-none`}>
            <div className="sidebar-header">
                <FontAwesomeIcon icon={faTimes} onClick={() => setShowSidebar(false)} />
            </div>
            <div className="sidebar-content">
                <br />
                <Navbar.Brand href="/home" style={{  marginLeft: "20px" }}>
                    <img src={navbarLogo} alt="logo" className='logo-home' />
                </Navbar.Brand>
                <br />
                <br />
                <br />
                <Nav className="flex-column mt-5">
                    <Nav.Link className={`nav--link custom-link ${darkMode ? 'dark-mode' : ''} ${location.pathname === '/home' || activeLink === '/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/home')} style={{ marginLeft: '20px' }} > 
                        <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} /> Home
                    </Nav.Link>
                    <Nav.Link className={`nav--link custom-link ${darkMode ? 'dark-mode' : ''} ${location.pathname === '/about' || activeLink === '/about' ? 'active' : ''}`} onClick={() => handleLinkClick('/about')} style={{ marginLeft: '20px' }} > 
                        <FontAwesomeIcon icon={faUserGroup} style={{ marginRight: '10px' }} /> About
                    </Nav.Link>
                    <Nav.Link className={`nav--link custom-link ${darkMode ? 'dark-mode' : ''} ${location.pathname === '/faqs' || activeLink === '/faqs' ? 'active' : ''}`} onClick={() => handleLinkClick('/faqs')} style={{ marginLeft: '20px' }} > 
                        <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: '10px' }} /> FAQS
                    </Nav.Link>
                </Nav>
                <Nav className="flex-column" style={{ marginLeft:  "13px" }}>
                    <br />
                    <NavDropdown title="PROFILE" id="collapsible-nav-dropdown" className='profile'>

                        <NavDropdown.Item href="/view-profile" className='profile--attribute' >
                            <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> View Profile
                        </NavDropdown.Item>
                        {
                            admin && (
                                <NavDropdown.Item href="/upload-capstone" className='profile--attribute' style={{ marginTop: '10px' }} >
                                    <FontAwesomeIcon icon={faUpload} className="mr-2" /> Upload Capstone
                                </NavDropdown.Item>
                            )
                        }
                        {
                            admin && (
                                <NavDropdown.Item href="/dashboard" className='profile--attribute' style={{ marginTop: '10px' }} >
                                    <FontAwesomeIcon icon={faDashboard} className="mr-2" /> Dashboard
                                </NavDropdown.Item>
                            )
                        }
                        <NavDropdown.Item onClick={() => setShowModal(true)} className='profile--attribute' style={{ marginTop: '10px' }} >
                            <FontAwesomeIcon icon={faMoon} className="mr-2" /> Modes
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout} className='item-dropdown '>
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: 'black' }}>Modes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant={darkMode ? "light" : "dark"} onClick={() => {toggleMode(); setShowModal(false)}}>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
            </Modal.Body>
        </Modal>

    </>
  );
}