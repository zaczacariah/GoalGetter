const router = require('express').Router();
// Import the routes. This is how we make our routes modular.
const goalRoutes = require('./goalRoutes');
const actionableRoutes = require('./actionableRoutes')
// const habitualRoutes = require('./habitualRoutes');
// When a request is made to the /users or /projects path, it will be directed to the index.js in the /users or /projects folder.
router.use('/goals', goalRoutes);
router.use('/goals/actionable', actionableRoutes);
// router.use('/goals/habitual', habitualRoutes);
module.exports = router;
