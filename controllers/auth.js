const { response } = require("express");
const { pool } = require("../database/config");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const { generarJWT } = require("../helpers/jwt");
const { json } = require("body-parser");

const crearUsuario = async (req, res = response) => {

    try {

        let { email, password } = req.body;

        const querySelect = "SELECT * FROM users WHERE email = $1";
        const existeEmail = await pool.query(querySelect, [email]);

        if (existeEmail.rows[0] !== undefined) {
            return res.status(400).json({
                ok: false,
                message: 'El correo ya esta registrado'
            });
        }

        const user = new UserModel(
            name = req.body.name,
            email = req.body.email,
            password = req.body.password
        );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        const sql = "INSERT INTO users(name, email, password, online) VALUES ($1, $2, $3, $4) RETURNING iduser";
        const values = [user.name, user.email, user.password, user.online];

        const result = await pool.query(sql, values);
        const newId = result.rows[0].iduser;

        // Generar JWT
        const token = await generarJWT(newId);

        res.json({
            ok: true,
            msg: 'Crear Usuario',
            usuario: {
                uid: newId,
                name: user.name,
                email: user.email,
            },
            token: token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador.'
        });
    }

}

const login = async (req, res = response) => {
    try {
        let { email, password } = req.body;

        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rows[0] == 0) {
            return res.status(400).json({
                ok: false,
                message: 'El email no existe.'
            });
        }

        // Validar password
        const validPass = bcrypt.compareSync(password, result.rows[0].password);
        if (!validPass) {
            return res.status(400).json({
                ok: false,
                message: 'La constraseña no es valida.'
            });
        }

        // Generar JWT
        const token = await generarJWT(result.rows[0].iduser);

        res.json({
            ok: true,
            usuario: result.rows[0],
            token: token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador.'
        });
    }
}

const renewToken = async (req, res = response) => {

    try {
        const uid = req.uid;

        // Generar JWT
        const token = await generarJWT(uid);

        // Obtener usuario
        const query = "SELECT * FROM users WHERE iduser = $1";
        const result = await pool.query(query, [uid]);

        if (result.rows[0] == 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe.'
            });
        }


        res.json({
            ok: true,
            usuario: result.rows[0],
            token: token
        });
    } catch (error) {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}