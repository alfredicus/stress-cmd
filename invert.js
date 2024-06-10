const { program } = require('commander')
const STRESS = require('../stress/dist/@alfredo-taboada/stress')
const fs = require('fs')

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1)
}

program.name('invert')
program.description(`Tecto-Stress is a web application that enables tectonic stress inversion
by utilizing various types of data such as fault striae, fracture orientation...,
and combining them to better constrain the inversion.

Usage:
  node invert.js example/1/model.json
`)
program.version('0.1.0', '-v, --vers', 'output the current version');
program.parse()

if (process.argv.length !== 3) {
    throw 'Missing input file (json)'
}


const modelName = process.argv[2]
const path = modelName.substring(0, modelName.lastIndexOf('/') + 1) // +1 to keep the '/' character

const json = JSON.parse(fs.readFileSync(modelName, 'utf8'))

const runner = new STRESS.Runner()

if (json.options !== undefined) {
    runner.setOptions(json.options)
}

let total = 0

json.dataset.forEach( dataset => {
    const jsonData = fs.readFileSync(path + dataset.file, 'utf8')

    dataset.weight ??= 1
    dataset.active ??= true

    let count = 0

    if (dataset.weight !== 0 && dataset.active ) {
        count += runner.addDataset({
            buffer: jsonData,
            fileExtension: getExtension(dataset.file),
            weight: dataset.weight
        })
    }

    total += count
    console.log(`Nb data for ${dataset.file}: ${count}`)
})

console.log('Nb total data:', total)

runner.run()







/*
program.name('invert')
program.description(`Tecto-Stress is a web application that enables tectonic stress inversion
by utilizing various types of data such as fault striae, fracture orientation...,
and combining them to better constrain the inversion.

TODO: Add weight for each dataset using the flag -w or --weight
`)
program.version('0.1.0', '-v, --vers', 'output the current version');
program.requiredOption('-d, --dataset [string]', 'one to many dataset files sperarated by spaces. Format can be json, csv... Refer to the documentation for more information')
program.option('-o, --option <string>', 'the option json file. Refer to the documentation for more information')
program.parse()



function detectMultipleDataFiles(rawArgs) {
    const dataFiles = []

    let indexData = rawArgs.findIndex( e => e === '-d' || e === '--data' )
    indexData++

    while(true) {
        if (indexData > rawArgs.length-1) {
            break
        }

        const line = rawArgs[indexData]
        
        if (line.startsWith('-')) {
            break
        }

        dataFiles.push(line)
        indexData++
    }

    return dataFiles
}

const dataFiles = detectMultipleDataFiles(program.rawArgs)

if (dataFiles.length) {

    const runner = new STRESS.Runner()

    if (program.opts().option !== undefined) {
        const opts = JSON.parse(fs.readFileSync(program.opts().option, 'utf8'))
        runner.setOptions(opts)
    }

    dataFiles.forEach( file => {
        const jsonData = fs.readFileSync(file, 'utf8')
        runner.addData(jsonData, getExtension(file))
    })

    runner.run()
}
else {
    throw 'No data file provided'
}

*/