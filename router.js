import {
    handleGetPersons,
    handlePostPerson,
    handleGetPersonById,
    handleUpdatePerson,
    handleDeletePerson,
    handleAddContact
} from './handlers.js';

export const handlereq = (req, res) => {
    const { method, url } = req;
    const segments = url.split('/');
    const id = segments[2];

    switch (method) {
        case 'GET':
            if (url === '/pessoas') {
                handleGetPersons(req, res);
            } else if (url.startsWith('/pessoas/') && id) {
                handleGetPersonById(req, res, id);
            } else {
                handleNotFound(res);
            }
            break;
        case 'POST':
            if (url === '/pessoas') {
                handlePostPerson(req, res);
            } else if (url.startsWith('/pessoas/') && id) {
                handleAddContact(req, res, id);
            } else {
                handleNotFound(res);
            }
            break;
        case 'PUT':
            if (url.startsWith('/pessoas/') && id) {
                handleUpdatePerson(req, res, id);
            } else {
                handleNotFound(res);
            }
            break;
        case 'DELETE':
            if (url.startsWith('/pessoas/') && id) {
                handleDeletePerson(req, res, id);
            } else {
                handleNotFound(res);
            }
            break;
        default:
            handleNotFound(res);
    }
};

const handleNotFound = (res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
};
