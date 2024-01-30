import React, { useState, useEffect } from 'react';
import parseCSV from './parseCsv';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css'; // Make sure you have this line to import your CSS

const App = ({ signOut, user }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/mydata.csv')
            .then(response => response.text())
            .then(csvData => {
                return parseCSV(csvData);
            })
            .then(parsedData => {
                setData(parsedData);
            })
            .catch(error => {
                console.error('Error parsing CSV file:', error);
            });
    }, []);

    const renderTableHeader = () => {
        return data.length > 0 ? (
            <tr>
                {Object.keys(data[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                ))}
            </tr>
        ) : null;
    };

    const renderTableRows = () => {
        const indexOfLastItem = (currentPage + 1) * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

        return currentItems.map((row, index) => (
            <tr key={index}>
                {Object.values(row).map((val, idx) => (
                    <td key={idx}>{val}</td>
                ))}
            </tr>
        ));
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 0; i < Math.ceil(data.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    };

    return (
        <div>
            {/* Sign-out button and welcome message */}
            <div className="header">
                <h1>Welcome, {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
            </div>

            <h1>CSV Data Table</h1>
            <table>
                <thead>
                    {renderTableHeader()}
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
            <div className='pagination'>
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default withAuthenticator(App);
