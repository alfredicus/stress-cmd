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
  node invert.js -f example/1/model.json -l out.log
`)
program.version('0.1.0', '-v, --vers', 'output the current version')
program.option('-l, --log <string>', 'save the results in a specified log file')
program.requiredOption('-f, --file <string>', 'the model filename')
program.parse()

program.opts().log ??= undefined
const modelName = program.opts().file
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
            weight: dataset.weight,
            filename: path + dataset.file
        })
    }

    total += count
    console.log(`Nb data for ${dataset.file}: ${count}`)
})

console.log('Nb total data:', total)
const solution = runner.run()

if (program.opts().log !== undefined) {
    const output = JSON.stringify(solution, null, 4)
    fs.writeFileSync(program.opts().log, output)
}
