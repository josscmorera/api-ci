var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
 } = require('../controllers/report');

var router = express.Router();

router.post('/new', jwtValidate, createReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', jwtValidate, updateReport);
router.delete('/:id', jwtValidate, deleteReport);

module.exports = router;