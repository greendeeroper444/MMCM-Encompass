import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';
import PropTypes from 'prop-types';

export default function CapstoneSearch({ setSearchResults }) {
    const [searchQuery, setSearchQuery] = useState('');
    const {user, admin, darkMode} = useAuth();
    const [searchHistory, setSearchHistory] = useState([]);
    const searchHistoryRef = useRef(null);
    const inputRef = useRef(null);

    const handleSearch = async() => {
        try {

            if(!searchQuery.trim()){
                console.log('No query in input');
                return;
            }
    
            const response = await axios.get(`/capstone/search-capstone?q=${searchQuery}`);
            setSearchResults(response.data);
    
            let userType;
            if(admin){
                userType = 'Admin';
            } else if(user){
                userType = 'User';
            } else{
                console.error('No user or admin logged in');
                return;
            }
    
            const url = userType === 'Admin' ? '/capstone-search-history/searchHistoryAdmin/add' : '/capstone-search-history/searchHistoryUser/add';
            await axios.post(url, {
                query: searchQuery,
                userType: userType,
            });
    
            // setSearchQuery('');
            setSearchHistory([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            handleSearch();
            setSearchHistory([]);
        }
    };

    //to show list of search hsitroy
    const handleInputFocus = async() => {
        try {
            let response;
            if(admin){
                response = await axios.get('/capstone-search-history/searchHistoryAdmin');
            } else if(user){
                response = await axios.get('/capstone-search-history/searchHistoryUser');
            } else{
                console.error('No user or admin logged in');
                return;
            }
            
            setSearchHistory(response.data);
        } catch (error) {
            console.error('Error fetching search history:', error);
        }
    };
    

    const handleSearchHistoryClick = async(query) => {
        try {
            setSearchQuery(query); 
            await handleSearch(); 
        } catch (error) {
            console.error('Error searching:', error);
        }
    };
    
    
    //close search history dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event){
            if(searchHistoryRef.current && !searchHistoryRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setSearchHistory([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchHistoryRef, inputRef]);


    const handleDeleteSearchHistory = async(searchHistoryId) => {
        try {
            
            const userType = admin ? 'Admin' : 'User';

            const authId = admin ? admin.id : user.id;
    
            const response = await axios.delete(`/capstone-search-history/delete-searchHistory${userType}/${authId}/${searchHistoryId}`);
    
            if(response.status === 200){
                //remove the deleted item from the search history list
                const updatedSearchHistory = searchHistory.filter(searchHistory => searchHistory._id !== searchHistoryId);
                setSearchHistory(updatedSearchHistory);
                console.log('Search history item deleted successfully');
            } else{
                console.error('Failed to delete search history item');
            }
        } catch (error) {
            console.error('Error deleting search history item:', error);
        }
    };
    

  return (
    <div className="input-group mb-3 mt-5" ref={inputRef}>
        <div className="input-group-prepend">
            <span className={`input-group-text ${darkMode ? ' dark-mode' : ''}`}>
                <FontAwesomeIcon icon={faSearch} className='search-icon' />
            </span>
        </div>
            <div className={`form-control search-capstone ${darkMode ? ' dark-mode' : ''}`}>
                <input
                type="text"
                placeholder="Search for Capstone"
                className={`search-capstone-input${darkMode ? ' dark-mode' : ''}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                />

                {
                    searchHistory.length > 0 && searchQuery.trim() !== '' && (
                        <Autocomplete
                            searchQuery={searchQuery}
                            handleAutocomplete={handleSearch}
                            handleSearchHistoryClick={handleSearchHistoryClick}
                        />

                    )
                }

                {
                    searchHistory.length > 0 && (
                        <div className={`container-search-history ${darkMode ? ' dark-mode' : ''}`} ref={searchHistoryRef}>
                            <div className={`search-history-title ${darkMode ? ' dark-mode' : ''}`}>
                                <strong>Search History</strong>
                            </div>
                            <div className="search-history-dropdown">
                                <div className="search-history-list">
                                    {
                                        searchHistory.slice(0).reverse().map((searchHistory, index) => (
                                            <div key={index} className={`search-history-item ${darkMode ? ' dark-mode-hover' : ''}`} onClick={() => handleSearchHistoryClick(searchHistory.query)}>
                                                <div className="search-history-icons">
                                                    <FontAwesomeIcon icon={faHistory} className="history-icon" />
                                                </div>
                                                <span className="query-text">{searchHistory.query}</span>
                                                <div className="search-history-icons">
                                                    <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className="delete-icon"
                                                    onClick={(e) => {
                                                        //top the click event from bubbling up to the parent item
                                                        e.stopPropagation();
                                                        handleDeleteSearchHistory(searchHistory._id);
                                                    }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        <div className="input-group-append">
            <button className="btn search-button" type="button" onClick={handleSearch}>Search</button>
        </div>
    </div>


  );
}

CapstoneSearch.propTypes = {
    setSearchResults: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
};


const Autocomplete = ({ searchQuery, handleAutocomplete }) => {
    Autocomplete.propTypes = {
        searchQuery: PropTypes.string.isRequired,
        handleAutocomplete: PropTypes.func.isRequired,
    };

 
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        //to fetch suggestions from backend when searchQuery changes
        const fetchSuggestions = async() => {
            try {
                if(searchQuery.trim() === ''){
                     //to reset suggestions if searchQuery is empty
                    setSuggestions([]);
                    return;
                }

                const response = await axios.get(`/capstone/search-suggests?q=${searchQuery}`);
                setSuggestions(response.data);
            } catch (error){
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [searchQuery]);

    return (
        <ul className="autocomplete" style={{ listStyle: 'none', padding: 0 }}>
            {
                Array.isArray(suggestions) && suggestions.map((suggestion, index) => {
                    const startIndex = suggestion.toLowerCase().indexOf(searchQuery.toLowerCase());
                    const boldPart = suggestion.slice(0, startIndex);
                    const restOfSuggestion = suggestion.slice(startIndex + searchQuery.length);
                    return (
                        <li key={index} onClick={() => handleAutocomplete(suggestion)} style={{ padding: '5px 0' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ marginLeft: '5px', color: '#919191' }} />
                            {' '}
                            {boldPart}
                            <strong>{searchQuery}</strong>
                            {restOfSuggestion}
                        </li>
                    );
                })
            }
        </ul>
    );
};
