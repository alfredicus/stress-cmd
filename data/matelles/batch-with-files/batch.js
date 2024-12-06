/**
 * Use intermediate files to run a parametric study
 * CONNOT be run in a web browser!
 */

const { execSync } = require('child_process')
const fs = require('fs')

const model = {
    "dataset": [
        {
            "file": "../stylos/stylolites-1.json",
            "weight": 1
        },
        {
            "file": "../veins/veins-2.json",
            "weight": 1
        }
    ],
    "options": {
        "searchMethod": {
            "name": "Monte Carlo",
            "nbIter": 50000
        }
    }
}

const N = 10
for (let i = 0; i < N; ++i) {

    model.dataset[0].weight = i / (N - 1)
    model.dataset[1].weight = 1 - i / (N - 1)

    fs.writeFileSync(`model-${i}.json`, JSON.stringify(model, null, 4))

    execSync(`node ../../../invert.js -f model-${i}.json -l out-${i}.json`, (err, stdout, stderr) => {
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })

    const r = JSON.parse(fs.readFileSync(`out-${i}.json`, 'utf8'))
    console.log(`${i}: ${r.fit}`)
}
