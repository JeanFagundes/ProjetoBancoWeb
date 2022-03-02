const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validarcpf = require('cpf-cnpj-validator')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
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

        //verificando se será criado aqui o usuario na base de dados

        //pegando o ultimo ID do BD e adicionando +1 para usar como chave estrangeira na criação do endereço.
        /*const lastid = await User.findOne({
           order: [ [ 'createdAt', 'DESC' ]],
       });
       var userid = lastid.id + 1
       console.log('last id', userid) */

        //ainda validando se devo salvar sessão aqui
    }
}
