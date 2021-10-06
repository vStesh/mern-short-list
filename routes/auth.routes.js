const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = Router();
const config = require('config');

const MIN_LENGTH_PASSWORD = config.get('validate.minLengthPassword') || 6;


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', `Минимальная длинна пароля ${MIN_LENGTH_PASSWORD} символов`)
            .isLength({min: MIN_LENGTH_PASSWORD})
    ],
    async (req, res) => {
        console.log(req.body);
    try {
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            });
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email});
        if(candidate) {
            return res.status(400).json({message: "Такой пользователь уже существует"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: "Пользователь успешно зарегистрирован"});
    } catch (e) {
        res.status(500).json({message: 'Ошибка. Сервен не может обработать ваш запрос.'});
    }
});

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            });
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'Пользователь не найден'});
        }

        const isMAtch = await bcrypt.compare(password, user.password);

        if(!isMAtch) {
            res.status(400).json({message: 'Ошибка авторизации'});
        }

        const token = jwt.sign(
            {iserId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );

        res.json({token, userId: user.id});
    } catch (e) {
        res.status(500).json({message: 'Ошибка. Сервен не может обработать ваш запрос.'});
    }
});

module.exports = router;
