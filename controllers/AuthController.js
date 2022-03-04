const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validarcpf = require('cpf-cnpj-validator')

module.exports = class AuthController {
    
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        //pegando dados do html
        const {
            username,
            password
        } = req.body

        try {
            //laço para comparar o usuario com o banco de dados, usando o cpf como where
            const user = await User.findOne({
                where: {
                    cpf: username
                }
            })

            //checando se foi achado no banco de dados
            if (!user) {
                req.flash('message', 'Usuario não encontrado')
                res.render('auth/login')

                return
            }

            //descriptografando a senha e verificando se tem no banco de dados
            const passwordMatch = bcrypt.compareSync(password, user.password)

            if (!passwordMatch) {
                req.flash('message', 'Senha invalida!')
                res.render('auth/login')

                return
            }

            req.session.userid = user.id
            req.session.save(() => {
                res.redirect('/')
            })

        } catch (error) {
            console.log('não foi possivel logar', error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        //pegar dados de registro do usuario e fazer regras
        const {
            cpf,
            name,
            email,
            password,
            confirmpassword
        } = req.body

        //validação se senha é igual
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        //Validar se o cpf está correto
        if (!validarcpf.cpf.isValid(cpf)) {
            req.flash('message', 'CPF invalido!')
            res.render('auth/register')

            return
        }

        //validando se cpf ja existe no BD
        const checkIfUserExist = await User.findOne({
            where: {
                cpf: cpf
            }
        })

        //validando se ja existe o cpf do usuario
        if (checkIfUserExist) {
            req.flash('message', 'O CPF ja está em uso!')
            res.render('auth/register')

            return
        }

        //encriptar a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //crud do html
        const user = {
            cpf,
            name,
            email,
            password: hashedPassword,
        }

        //colocando o usuario criado em um objeto para passar o id para a sessão

        try {

            const createdUser = await User.create(user)
            // req.session.userid = createdUser.id
            res.redirect('/registerAddress')

        } catch (err) {
            req.flash('message', 'Não foi possivel criar o usuario' + err)
            res.render('auth/register')
        }
    }
}