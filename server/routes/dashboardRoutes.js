const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');



// GET /api/dashboard
router.get('/', authMiddleware, authorizeRoles('Admin','Manager','Accountant','Auditor'), dashboardController.getDashboard);

module.exports = router;