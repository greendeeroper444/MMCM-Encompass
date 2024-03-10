import React, { useContext, useEffect, useState } from 'react'
import CustomNavbar from '../components/CustomNavbar'
import CapstoneSearch from '../components/CapstoneSearch'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

export default function HomePage() {
    const {user, admin} = useContext(AuthContext);
    const [searchQuery] = useState("");

    const [searchResults, setSearchResults] = useState(() => {
        const storedResults = localStorage.getItem('searchResults');
        return storedResults ? JSON.parse(storedResults) : [];
    });
    useEffect(() => {
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }, [searchResults]);


    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(10);


    //pagination
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [searchPerformed, setSearchPerformed] = useState(() => {
        const storedSearchPerformed = localStorage.getItem('searchPerformed');
        return storedSearchPerformed ? JSON.parse(storedSearchPerformed) : false;
    });

    const handleSearchResults = (results) => {
        setSearchResults(results);
        setSearchPerformed(true);
        localStorage.setItem('searchPerformed', JSON.stringify(true));
    };
    // const [searchPerformed, setSearchPerformed] = useState(false);
    // const handleSearchResults = (results) => {
    //     setSearchResults(results);
    //     setSearchPerformed(true);
    // };
  return (
    <>
        <CustomNavbar />
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row vh-100 justify-content-center">
                <div className="col-md-8">
                    <div className="text-center">
                        {
                            user && !admin && (
                                <h1>Welcome Back, {user.name.split(' ')[0]}! 👋</h1>
                            )
                        }
                        {
                            admin && (
                                <h1>Welcome Back, {admin.username.split(' ')[0]}! 👋</h1>
                            )
                        }
                        <p className="lead">This system enables easy search for capstone projects, functioning as a search engine for quick access to relevant information.</p>
                    </div>


                    {/* capstone search component */}
                    <CapstoneSearch searchQuery={searchQuery} setSearchResults={handleSearchResults} />


                    {
                        searchPerformed && (
                            <div>
                                {
                                    currentResults.length > 0 ? (
                                        <div>
                                            <h4>Search Results</h4>
                                            <ul style={{ padding: 0 }}>
                                                {
                                                    currentResults.map((result) => (
                                                    <li key={result._id} style={{ listStyleType: 'none', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                                                        <div>
                                                            <Link to={`/capstone-details/${result._id}`}>
                                                                <p>{result.title}</p>
                                                            </Link>
                                                            <p style={{ fontSize: 'small' }}>{result.description}</p>
                                                            <p>{result.snippet}</p>
                                                            <p style={{ fontSize: 'small' }}>by {result.author}</p>
                                                        </div>
                                                    </li>
                                                
                                                    ))
                                                }
                                            </ul>
                                            
                                            {/* Pagination */}
                                            <nav>
                                                <ul className="pagination">
                                                {
                                                    Array.from({ length: Math.ceil(searchResults.length / resultsPerPage) }, (_, index) => (
                                                        <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                                            <button onClick={() => paginate(index + 1)} className="page-link">
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))
                                                }
                                                </ul>
                                            </nav>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                                            <p>No search results found</p>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
  );
}
