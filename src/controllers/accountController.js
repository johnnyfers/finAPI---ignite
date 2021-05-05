const { v4: uuidv4 } = require('uuid')

const customers = [];

const accountController = {

    create: (req, res) => {

        const { cpf, name } = req.body;
        const id = uuidv4();

        const customerExists = customers.some((customer) => customer.cpf === cpf)

        if (customerExists) return res.status(400).send('error')

        customers.push({
            cpf,
            name,
            id,
            statement: []
        })

        res.status(201).send('ok')
    },

    checkStatement: (req, res) => {

        const { customer } = req

        return res.json(customer.statement)

    },

    verifyAccountByCPF: (req, res, next) => {
        const { cpf } = req.params
        const customer = customers.find(customer => customer.cpf === cpf);

        if (!customer) return res.status(400).send('customer not found')

        req.customer = customer

        return next()

    },

    deposit: (req, res) => {
        const { description, amount } = req.body
        const { customer } = req

        const statementOp = {
            description,
            amount,
            created_at: new Date(),
            type: 'credit'
        }

        customer.statement.push(statementOp)

        return res.status(201).send()

    },

    getBalance: (statement) => {
        const balance = statement.reduce((acc, op) => {
            (op.type === 'credit') ? acc + op.amount : acc - op.amount
        }, 0)

        return balance

    },

    withdraw: (req, res) => {
        const { amount } = req.body
        const { customer } = req

        const balance = accountController.getBalance(customer.statement)

        if (balance < amount) return res.status(400).send('error: invalid funds')

        const statementOp = {
            amount,
            created_at: new Date(),
            type: 'debit'
        }

        customer.statement.push(statementOp)

        return res.status(201).send()

    },

    getStatementByData: (req, res) => {
        const { customer } = req
        const { date } = req.query
        const dateFormat = new Date(date + ' 00:00')

        const statement = customer.statement.filter((statement) =>
            statement.created_at.toDateString() === new Date(dateFormat).toDateString())

        return res.json(statement);
    },

    getAccount: (req, res) => {
        const { customer } = req

        return res.json(customer)
    },

    updateAccount: (req, res) => {
        const { name } = req.body
        const { customer } = req

        customer.name = name

        return res.status(201).send()

    },

    deleteAccount: (req, res) => {
        const { customer } = req

        customers.splice(customer, 1)

        return res.status(200).json(customer)
    },

    getBalanceByCPF: (req, res) => {
        const { customer } = req

        const balance = accountController.getBalance(customer.statement)

        return res.json(balance)
    }
}

module.exports = accountController


