/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email')
        .not().isEmpty()
        .withMessage('El email es obligatorio')
        .bail().isEmail()
        .withMessage('El email no es valido'),
    check('password')
        .not().isEmpty()
        .withMessage('La contraseña es obligatoria')
        .bail().isLength({ min: 6 })
        .withMessage('La contraseña debe tener un minimo de 6 caracteres.'),
    validarCampos
], crearUsuario);

router.post('/', [
    check('email')
        .not().isEmpty()
        .withMessage('El email es obligatorio')
        .bail().isEmail()
        .withMessage('El email no es valido'),
    check('password')
        .not().isEmpty()
        .withMessage('La contraseña es obligatoria'),
    validarCampos
], login);


router.get('/renew', validarJWT, renewToken);



module.exports = router;