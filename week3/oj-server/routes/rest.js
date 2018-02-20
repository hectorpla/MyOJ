const express = require('express')
const bodyParser = require('body-parser')
const nodeRestClient = require('node-rest-client').Client

const ProblemService = require('../services/problemService')

const router = express.Router()
const jsonParser = bodyParser.json()

// RESTful client initialization
const restClient = new nodeRestClient()

// executor initialization
const EXECUTOR_SERVER_URL = 'http://192.168.56.101:5000'

router.get('/problems', function(req, res) {
    ProblemService.getProblems()
        .then(problems => res.json(problems))
        .catch(error => res.status(400).send(err))
})

router.get('/problems/:id', function(req, res) {
    ProblemService.getProblem(req.params.id)
        .then(problem => res.json(problem))
        .catch(err => { res.status(400).send(err) })
})

router.delete('/problems/:id', function(req, res) {
    ProblemService.deleteProblem(req.params.id)
        .then(problem => res.json(problem))
        .catch(err => res.status(400).send(err))
})

router.post('/problems', jsonParser, function(req, res) {
    // console.log('router.post: ' + JSON.stringify(req.body))
    ProblemService.addProblem(req.body)
        .then(p => res.json(p))
        .catch(err => res.status(400).send(err)) // oneliner arrow function (statement?)
})

router.put('/problems', jsonParser, function(req, res) {
    ProblemService.modifyProblem(req.body)
        .then(p => res.json(`successfully modify problem '${req.body.name}' if it exists`))
        .catch(err => res.status(400).send(err))
})
 
router.post('/build-and-run', jsonParser, function(req, res) {
    console.log('build-and-run:', JSON.stringify(req.body))
    restClient.post(EXECUTOR_SERVER_URL + '/build-and-run', {
            headers: {'Content-Type': 'application/json'},
            data: req.body
        },
        function(data, response) {
            console.log('Build-and-run (got result):', JSON.stringify(data))
            res.json(data);
        })
        .on('error', function(err) {
            console.log('Failure to connect the executor server', err)
            res.status(500).json('Cannot execute code!')
        })
}) 

module.exports = router // exports