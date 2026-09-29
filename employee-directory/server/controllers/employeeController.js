const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

const createEmployee = async (req, res) => {
  const { name, email, phone, position, department } = req.body;

  if (!name || !email || !phone || !position || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department does not exist' });
    }

    const newEmployee = await Employee.create({
      name,
      email,
      phone,
      position,
      department,
      createdBy: req.user.id,
    });

    return res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployees = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const employees = await Employee.find({ createdBy: req.user.id })
      .populate('department', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Employee.countDocuments({ createdBy: req.user.id });

    return res.status(200).json({
      data: employees,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate('department', 'name');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { name, email, phone, position, department } = req.body;

  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (department) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({ message: 'Department does not exist' });
      }
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.position = position || employee.position;
    employee.department = department || employee.department;

    await employee.save();
    return res.status(200).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.remove();
    return res.status(200).json({ message: 'Employee deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchEmployees = async (req, res) => {
  const searchTerm = (req.query.q || '').trim();

  if (!searchTerm) {
    return res.status(200).json({ data: [] });
  }

  try {
    const employees = await Employee.find({
      createdBy: req.user.id,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { position: { $regex: searchTerm, $options: 'i' } },
      ],
    }).populate('department', 'name');

    return res.status(200).json({ data: employees });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateEmployeeStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Status must be active or inactive' });
  }

  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.status = status;
    await employee.save();

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployeeStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const stats = await Employee.aggregate([
      { $match: { createdBy: ownerId } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $project: {
          _id: 0,
          department: { $arrayElemAt: ['$department.name', 0] },
          count: 1,
        },
      },
    ]);

    return res.status(200).json({ data: stats });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  updateEmployeeStatus,
  getEmployeeStats,
};