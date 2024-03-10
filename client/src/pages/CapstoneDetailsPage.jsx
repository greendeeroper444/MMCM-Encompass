import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/authContext';

export default function CapstoneDetailsPage() {
    const [capstone, setCapstone] = useState(null);
    const {capstoneId} = useParams();
    const {darkMode} = useAuth();

    useEffect(() => {
        const fetchCapstoneDetails = async() => {
            try {
                const { data } = await axios.get(`/capstone/capstone-details/${capstoneId}`);
                setCapstone(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCapstoneDetails();

        //cleanup funvtion to cancel the request if the component unmounts
        return () => {
            
        };
    }, [capstoneId]);


    const showPdf = (pdf) => {
        window.open(`${pdf}`, "_blank", "noreferrer");
    }

  return (
    <div className='container mt-5'>
        {
            capstone ? (
                <div className='card'>
                    <div className={`card-body ${darkMode ? ' dark-mode' : ''}`}>
                        <h1 className="card-title">{capstone.title}</h1>
                        <p className="card-text">{capstone.description}</p>
                        <p><strong>by</strong> {capstone.author}</p>
                        <button className={`btn pdf--button ${darkMode ? ' dark-mode' : ''}`} onClick={() => showPdf(capstone.pdf)}>
                            <FontAwesomeIcon icon={faFilePdf} className="mr-2" style={{ color: "red" }} /> {capstone.pdf.split('/').pop()}
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )
        }
    </div>
  );
}
