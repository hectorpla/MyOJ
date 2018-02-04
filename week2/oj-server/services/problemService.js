let problems = [
    {   id: 1,
        name: 'aa',
        desc: '..',
        difficulty: 'easy'
    },
    {
        id: 2,
        name: 'bbb',
        desc: '111',
        difficulty: 'hard'
    }
]

function getProblems() {
    return new Promise((resolve, reject) => resolve(problems))
}

function getProblem(id) {
    return new Promise((resolve, reject) => {
        problem = problems.find(problem => problem.id == id)
        if (problem) {
            resolve(problem)
        } else {
            reject(`the problem ${id} doesn't exist`)
        }
    })
}

function addProblem(newProblem) {
    return new Promise((resolve, reject) => {
        // console.log(JSON.stringify(newProblem))
        if (problems.find(problem => problem.name === newProblem.name)) {
            console.log('to reject')
            reject(`the problem '${newProblem.name}' exists`)
        }
        else {
            newProblem.id = problems.length + 1
            problems.push(newProblem) // used problems.append, no error in the console
            console.log('to resolve')
            resolve(newProblem)
        }
    })
}

function modifyProblem(modifiedProblem) {
    return new Promise((resolve, reject) => {
        if (modifiedProblem.name == undefined) {
            reject('please specify problem name')
        }
        problem = problems.find(problem => problem.name === modifiedProblem.name)
        if (!problem) {
            reject(`no such a problem '${modifiedProblem.name}'`)
        }
        Object.assign(problem, modifiedProblem)
        resolve(problem)
    })
}

module.exports = {
    getProblems,
    getProblem,
    addProblem,
    modifyProblem,
}