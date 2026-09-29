const express = require('express');
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
} = require('../controllers/departmentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createDepartment);
router.get('/', auth, getDepartments);
router.get('/:id/employees', auth, getDepartmentEmployees);
router.get('/:id', auth, getDepartmentById);
router.put('/:id', auth, updateDepartment);
router.delete('/:id', auth, deleteDepartment);

module.exports = router;
