const router = require('express').Router();
// Import the routes. This is how we make our routes modular.
const goalRoutes = require('./goalRoutes');
const actionableRoutes = require('./actionableRoutes');
const actionableEntryRoutes = require('./actionableEntryRoutes')
const habitualRoutes = require('./habitualRoutes');
const habitualEntryRoutes = require('./habitualEntryRoutes');

// When a request is made to the /users or /projects path, it will be directed to the index.js in the /users or /projects folder.
router.use('/goals', goalRoutes);
router.use('/goals/actionable', actionableRoutes);
router.use('/goals/actionable/entry', actionableEntryRoutes);
router.use('/goals/habitual', habitualRoutes);
router.use('/goals/habitual/entry', habitualEntryRoutes);

module.exports = router;
