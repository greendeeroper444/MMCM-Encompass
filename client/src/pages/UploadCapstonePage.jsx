import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import { useAuth } from '../../contexts/authContext';

export default function UploadDataPage() {
    const {darkMode} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        pdf: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pdf: e.target.files[0] });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('pdf', formData.pdf);

            const response = await axios.post('/capstone/upload-capstone', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(response.data.error){
                toast.error(response.data.error);
            } else {
                setFormData({
                    title: '',
                    description: '',
                    author: '',
                    pdf: null,
                });
                  toast.success(response.data.message);
                  navigate('/upload-capstone'); 
            }
        } catch (error) {
            console.error('Error uploading data:', error);
            toast.error('Error uploading data. Please try again later.');
        }
    };

  return (
    <>
    <CustomNavbar />
        <Container style={{ marginTop: '100px' }} className={`${darkMode ? ' dark-mode' : ''}`}>
            <h2 className="mt-4 mb-3">Upload Capstone Data</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`upload--input ${darkMode ? ' dark-mode' : ''}`}
                    autoComplete='off'
                    required
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                    autoComplete='off'
                    required
                    />
                </Form.Group>
                <Form.Group controlId="author">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                    autoComplete='off'
                    required
                    />
                </Form.Group>
                <Form.Group controlId="pdf">
                    <Form.Label>PDF:</Form.Label>
                    <Form.Control
                    type="file"
                    name="pdf"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                    required
                    />
                </Form.Group>
                <br />
                <Button variant="danger" type="submit">
                    Upload
                </Button>
            </Form>
        </Container>
    </>
  );
}
