const Department = require('../models/Department');
const Employee = require('../models/Employee');

const createDepartment = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const existingDepartment = await Department.findOne({ name: name.trim() });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department name already exists' });
    }

    const department = await Department.create({
      name: name.trim(),
      description: description || '',
    });

    return res.status(201).json(department);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDepartments = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const departments = await Department.find().skip(skip).limit(limit);
    const total = await Department.countDocuments();

    return res.status(200).json({
      data: departments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const existingDepartment = await Department.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: 'Department name already exists' });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description || '',
      },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDepartmentEmployees = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const employees = await Employee.find({
      department: req.params.id,
      createdBy: req.user.id,
    })
      .populate('department', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Employee.countDocuments({
      department: req.params.id,
      createdBy: req.user.id,
    });

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

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
};