const express = require('express')
const routes = express.Router()
const accountController = require('./controllers/accountController')

const middleware = accountController.verifyAccountByCPF

routes.post('/account', accountController.create)
routes.post('/deposit/:cpf', middleware, accountController.deposit)
routes.post('/withdraw/:cpf', middleware, accountController.withdraw)

routes.get('/statement/:cpf' , middleware, accountController.checkStatement )
routes.get('/statement/:cpf/data' , middleware, accountController.getStatementByData)
routes.get('/account/:cpf', middleware, accountController.getAccount)
routes.get('/balance/:cpf', middleware, accountController.getBalanceByCPF)

routes.put('/account/:cpf', middleware, accountController.updateAccount)

routes.delete('/account/:cpf', middleware, accountController.deleteAccount)

module.exports = routes