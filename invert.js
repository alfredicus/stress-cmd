const { program } = require('commander')
const STRESS = require('../stress/dist/@alfredo-taboada/stress')
const fs = require('fs')

program.name('stress-cmd')
program.description(`Tecto-Stress is a web application that enables tectonic stress inversion
by utilizing various types of data such as fault striae, fracture orientation...,
and combining them to better constrain the inversion.`)
program.version('0.1.0', '-v, --vers', 'output the current version');
program.option('-d, --data <string>', 'one to many data files. Format can be json, csv... Refer to the documentation for more information')
program.option('-o, --option <string>', 'the option json file')
program.parse()

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1)
}

const options = program.opts()

if (options.data) {

    const runner = new STRESS.Runner()

    if (options.option !== undefined) {
        const opts = JSON.parse(fs.readFileSync(options.option, 'utf8'))
        runner.setOptions(opts)
    }

    const jsonData = fs.readFileSync(options.data, 'utf8')
    runner.addData(jsonData, getExtension(options.data))

    runner.run()
}
else {
    // what else ?
}
