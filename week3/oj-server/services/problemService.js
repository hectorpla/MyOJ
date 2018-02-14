const ProblemModel = require('../models/problemModel')

function getProblems() {
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, (err, problems) => {
            if (err) {
                reject(err)
            } else {
                resolve(problems)
            }
        })
    })
}

function getProblem(id) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id: id}, (err, problem) => {
            if (err) {
                reject(`the problem ${id} doesn't exist`)
            } else {
                resolve(problem)
            }
        })
    })
}

function addProblem(newProblem) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({name: newProblem.name}, (err, problem) => {
            if (problem) {
                reject(`the problem '${newProblem.name}' exists`)
            } else {
                // ProblemModel.count({}, (err, count) => {
                //     newProblem.id = count + 1 // buggy, should, if allowing deletion of problems
                //     const problemToAdd = new ProblemModel(newProblem)
                //     problemToAdd.save()
                //     resolve(newProblem)
                // })
                console.log('about to aggregate')
                ProblemModel.aggregate([{$group: {_id: null, last: {$max: "$id"}}}],
                    (err, result) => {
                        if (err) { // if the database is empty, this branch is still not able
                                   // to be reached
                            console.log(JSON.stringify(err))
                            newProblem.id = 1
                            new ProblemModel(newProblem).save()
                            resolve(problem)
                        }
                        else {
                            console.log(JSON.stringify(result))
                            newProblem.id = 
                                (result && result.length) ? result[0].last + 1 : 1
                                 // is there a better way?
                            new ProblemModel(newProblem).save()
                            resolve(problem)
                        }
                    })
            }
        })
    })
}

function modifyProblem(modifiedProblem) {
    return new Promise((resolve, reject) => {
        if (modifiedProblem.name == undefined) {
            reject('please specify problem name')
        }
        ProblemModel.findOneAndUpdate({name: modifiedProblem.name},
            modifiedProblem, (err, problem) => {
                if (err) {
                    reject(err) // bad: no error occur if the problem doesn't exist
                } else {
                    resolve(`modified '${modifiedProblem.name} successfully`)
                }
            })
    })
}

function deleteProblem(id) {
    return new Promise((resolve, reject) => {
        // should find and resolve the found problem if it exists
        ProblemModel.deleteOne({id: id}, (err, problem) => {
            if (err) {
                reject(err)
            } else {
                resolve(problem)
            }
        })
    })
}

module.exports = {
    getProblems,
    getProblem,
    addProblem,
    modifyProblem,
    deleteProblem,
}