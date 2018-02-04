const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const ProblemService = require('../services/problemService')

const jsonParser = bodyParser.json()

router.get('/problems', function(req, res) {
    ProblemService.getProblems()
        .then(problems => res.json(problems))
        // .catch(error => {})
})

router.get('/problems/:id', function(req, res) {
    ProblemService.getProblem(req.params.id)
        .then(problem => res.json(problem))
        .catch(err => { res.status(400).send(err) })
})

router.post('/problems', jsonParser, function(req, res) {
    console.log('router.post: ' + JSON.stringify(req.body))
    ProblemService.addProblem(req.body)
        .then(p => res.json(p))
        .catch(err => res.send(err)) // oneliner arrow function (statement?)
})

router.put('/problems', jsonParser, function(req, res) {
    ProblemService.modifyProblem(req.body)
        .then(p => res.send(`successfully modify problem '${req.body.name}'`))
        .catch(err => res.send(err))
})

module.exports = router // exports