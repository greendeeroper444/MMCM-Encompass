import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import { useAuth } from '../../contexts/authContext';

export default function UpdateCapstone() {
    const navigate = useNavigate();
    const {darkMode} = useAuth();
    const {capstoneId} = useParams();
    const [data, setData] = useState({
        title: '',
        description: '',
        author: '',
        pdf: ' '
    });

    useEffect(() => {
        const fetchCapstoneData = async() => {
            try {
                const response = await axios.get(`/capstone/get-update-capstone/${capstoneId}`);
                const { title, description, author, pdf } = response.data.capstone;
                setData({
                    title: title || '',
                    description: description || '',
                    author: author || '',
                    pdf: pdf.split('/').pop()
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchCapstoneData();
    }, [capstoneId]);

    const handleUpdate = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('author', data.author);
        formData.append('pdf', data.pdf);

        try {
            const response = await axios.put(`/capstone/update-capstone/${capstoneId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                toast.success(response.data.message);
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <>
    <CustomNavbar />
        <Container style={{ marginTop: '100px' }} className={`${darkMode ? ' dark-mode' : ''}`}>
                <h2 className="mt-4 mb-3">Upload Capstone Data</h2>
                <Form onSubmit={handleUpdate}>

                    <Form.Group controlId="title">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className={`upload--input ${darkMode ? ' dark-mode' : ''}`}
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="description">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="author">
                        <Form.Label>Author:</Form.Label>
                        <Form.Control
                            type="text"
                            name="author"
                            value={data.author}
                            onChange={(e) => setData({ ...data, author: e.target.value })}
                            className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="pdf" className="position-relative">
                        <Form.Label>PDF:</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                            type="text"
                            name="pdf"
                            value={data.pdf ? (typeof data.pdf === 'string' ? data.pdf : data.pdf.name) : ''}
                            readOnly
                            className={`upload--input${darkMode ? ' dark-mode' : ''}`}
                            onClick={() => document.getElementById('pdfInput').click()} 
                            style={{ cursor: 'pointer' }} />

                            <input
                            id="pdfInput"
                            type="file"
                            name="pdf"
                            onChange={(e) => setData({ ...data, pdf: e.target.files[0] })}
                            className="ml-2 position-absolute top-0 start-0 translate-middle-y"
                            style={{ opacity: 0 }} />
                        </div>
                    </Form.Group>
                    <br />
                    <Button variant="danger" type="submit">
                        Upload
                    </Button>
                </Form>
        </Container>
    </>
  )
}
