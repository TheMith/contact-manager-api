import fs from 'fs';
import { randomUUID } from 'crypto';

const dataPath = './data.json';

const loadData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
    }
};

const saveData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error('Error writing data:', err);
    }
};

export const handleGetPersons = (req, res) => {
    const data = loadData();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

export const handlePostPerson = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const newData = JSON.parse(body);
        const data = loadData();
        const newPerson = { ...newData, id: randomUUID() };
        if (Array.isArray(data)) {
            data.push(newPerson);
            saveData(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newPerson));
        } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Data is not an array' }));
        }
    });
};

export const handleGetPersonById = (req, res, id) => {
    const data = loadData();
    const person = data.find(person => person.id === id);
    if (person) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(person));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Person not found' }));
    }
};


export const handleUpdatePerson = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const updatedData = JSON.parse(body);
        const data = loadData();
        const index = data.findIndex(person => person.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedData };
            saveData(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[index]));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Person not found' }));
        }
    });
};

export const handleDeletePerson = (req, res, id) => {
    const data = loadData();
    const index = data.findIndex(person => person.id === id);
    if (index !== -1) {
        data.splice(index, 1);
        saveData(data);
        res.statusCode = 204;
        res.end();
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Person not found' }));
    }
};

export const handleAddContact = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const contactUpdates = JSON.parse(body);
        const data = loadData();
        const index = data.findIndex(person => person.id === id);
        if (index !== -1) {
            data[index].email = contactUpdates.email;
            data[index].cellphone = contactUpdates.cellphone;
            saveData(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[index]));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Person not found' }));
        }
    });
};


