import Papa from 'papaparse';

const parseCSV = (csvString) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

export default parseCSV;