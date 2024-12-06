/**
 * DO NOT use intermediate files to run a parametric study.
 * Can be run in a web browser
 */

const STRESS = require('../../../../stress/dist/@alfredo-taboada/stress')
const fs = require('fs')

function setOption(runner) {
    runner.setOptions({
        searchMethod: {
            name: "Monte Carlo",
            nbIter: 50000
        }
    })
}

function addDataset(dataset, runner) {
    const jsonData = fs.readFileSync(dataset.file, 'utf8')
    let count = 0

    if (dataset.weight !== 0 && dataset.active) {
        count += runner.addDataset({
            buffer: jsonData,
            fileExtension: 'json',
            weight: dataset.weight,
            filename: dataset.file
        })
    }
}

// ------------------------------------------------

const N = 10

for (let i = 0; i < N; ++i) {
    const w1 = Math.random()
    const w2 = 1 - w1

    const runner = new STRESS.Runner()
    setOption(runner)

    addDataset({
        file: '../stylos/stylolites-1.json',
        weight: w1,
        active: true
    }, runner)

    addDataset({
        file: '../veins/veins-2.json',
        weight: w2,
        active: true
    }, runner)

    const solution = runner.run()
    console.log(`${i}: ${solution.fit}`)
}
