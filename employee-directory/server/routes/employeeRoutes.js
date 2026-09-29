const express = require('express');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  updateEmployeeStatus,
  getEmployeeStats,
} = require('../controllers/employeeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/search', auth, searchEmployees);
router.get('/stats', auth, getEmployeeStats);
router.post('/', auth, createEmployee);
router.get('/', auth, getEmployees);
router.get('/:id', auth, getEmployeeById);
router.put('/:id', auth, updateEmployee);
router.patch('/:id/status', auth, updateEmployeeStatus);
router.delete('/:id', auth, deleteEmployee);

module.exports = router;
