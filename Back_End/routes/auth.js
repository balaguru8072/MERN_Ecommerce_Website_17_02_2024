const express = require('express');
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'user'));
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const {
    registerUser,
    loginUser,
    logoutUSer,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/authController');
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/authenticate')

router.post('/register', upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUSer);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/myprofile/update').put(isAuthenticatedUser, updateProfile);

//Admin routes

router.route('/admin/user').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
                                .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)



module.exports = router;