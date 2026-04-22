const db = require('../models/db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)))
  );

// GET /api/users - Get all users with their roles
exports.getAllUsers = async (req, res) => {
  try {
    console.log('🔍 Fetching all users...');
    
    const users = await query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.is_active,
        u.created_at,
        COALESCE(r.id, 0) as role_id,
        COALESCE(r.role_name, 'User') as role_name,
        COALESCE(r.description, '') as role_description
      FROM users u
      LEFT JOIN user_roles ur ON u.id = CAST(ur.user_id AS UNSIGNED)
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.created_at DESC
    `);

    console.log('✅ Users fetched successfully:', users.length);
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      users: users || []
    });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: err.message
    });
  }
};

// GET /api/roles - Get all available roles
exports.getAllRoles = async (req, res) => {
  try {
    console.log('🔍 Fetching all roles...');
    
    const roles = await query(`
      SELECT 
        id,
        role_name,
        description,
        is_system_role,
        created_at
      FROM roles
      ORDER BY role_name ASC
    `);

    console.log('✅ Roles fetched successfully:', roles.length);
    res.json({
      success: true,
      message: 'Roles retrieved successfully',
      roles: roles || []
    });
  } catch (err) {
    console.error('❌ Error fetching roles:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: err.message
    });
  }
};

// GET /api/users/:id - Get single user
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching user ${id}...`);

    const users = await query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.created_at,
        COALESCE(r.id, 0) as role_id,
        COALESCE(r.role_name, 'User') as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = CAST(ur.user_id AS UNSIGNED)
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User fetched successfully');
    res.json({
      success: true,
      message: 'User retrieved successfully',
      user: users[0]
    });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message
    });
  }
};

// PUT /api/users/:id - Update user status or details
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, name, email, role_id } = req.body;
    
    console.log(`✏️ Updating user ${id}:`, req.body);

    // Check if user exists first
    const userCheck = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateParams = [];

    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(is_active ? 1 : 0);
      console.log(`📝 Toggling user status to ${is_active ? 'active' : 'inactive'}`);
    }
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateParams.push(email);
    }

    let updateResult = { affectedRows: 0 };

    // Update user table if there are fields to update
    if (updateFields.length > 0) {
      updateParams.push(id);
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      updateResult = await query(sql, updateParams);
    }

    // Update user role if role_id is provided
    if (role_id !== undefined) {
      console.log(`📝 Updating user role to ${role_id}`);
      
      // Check if user already has a role assignment
      const existingRole = await query(
        'SELECT id FROM user_roles WHERE user_id = ?',
        [id]
      );

      if (existingRole.length > 0) {
        // Update existing role
        await query(
          'UPDATE user_roles SET role_id = ? WHERE user_id = ?',
          [role_id, id]
        );
      } else {
        // Create new role assignment
        await query(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [id, role_id]
        );
      }
    }

    console.log('✅ User updated successfully');
    res.json({
      success: true,
      message: 'User updated successfully',
      affectedRows: updateResult.affectedRows
    });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: err.message
    });
  }
};

// DELETE /api/users/:id - Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting user ${id}...`);

    // Check if user exists
    const users = await query('SELECT id, name FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Failed to delete user'
      });
    }

    console.log(`✅ User ${users[0].name} deleted successfully`);
    res.json({
      success: true,
      message: `User ${users[0].name} deleted successfully`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: err.message
    });
  }
};

// POST /api/users - Create new user
exports.createUser = async (req, res) => {
  try {
    const { email, name, password, role_id } = req.body;
    
    console.log('➕ Creating new user:', { email, name, role_id });

    // Validation
    if (!email || !name || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, name, password, role_id'
      });
    }

    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Use password as-is (in production, you should hash this with bcrypt)
    const result = await query(
      'INSERT INTO users (email, name, password, created_at) VALUES (?, ?, ?, NOW())',
      [email, name, password]
    );

    // Assign role to new user
    await query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [result.insertId, role_id]
    );

    console.log('✅ User created successfully with ID:', result.insertId);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: err.message
    });
  }
};
