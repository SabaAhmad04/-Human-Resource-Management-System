const express = require('express');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
    uploadDocument,
    getMyDocuments,
    deleteDocument
} = require('../controllers/documentController');

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('file'), uploadDocument);

router.get('/', getMyDocuments);

router.delete('/:id', deleteDocument);

module.exports = router;
