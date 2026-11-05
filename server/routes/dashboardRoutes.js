const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');



// GET /api/dashboard
router.get('/', authMiddleware, authorizeRoles('Admin','Manager','Accountant','Auditor'), dashboardController.getDashboard);
=======

// GET /api/dashboard
router.get('/', dashboardController.getDashboard);
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

module.exports = router;