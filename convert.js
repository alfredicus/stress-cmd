const { program } = require('commander')
const STRESS = require('../stress/dist/@alfredo-taboada/stress')
const fs = require('fs')
const { exit } = require('process')

program.name('convert')
program.description(`Convert any known file format into a json proprietary format for tecto-stress.`)
program.version('0.1.0', '-v, --vers', 'output the current version');
program.option('-d, --data <string>', 'a data file to convert. Format can be csv... Refer to the documentation for more information')
program.option('-l, --list', 'list all available file formats')
program.parse()

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1)
}

function getBaseName(filename) {
    return filename.substring(0, filename.lastIndexOf('.'))
}

program.opts().list ??= false

if (program.opts().list === true) {
    STRESS.filter.Factory.names().forEach( name => {
        console.log('Available file formats:')
        console.log(`  ${name}`)
    })
    exit(0)
}

const file = program.opts().data

if (file) {
    const buffer = fs.readFileSync(file, 'utf8')

    const fctFilter = STRESS.filter.Factory.resolve(getExtension(file))
    if (fctFilter) {
        jsons = fctFilter(buffer, {})
        
        if (!jsons) {
            throw `Cannot convert your file with extension ${fileExtension} into JSON`
        }

        jsons = jsons.data
        
        const outFile = getBaseName(file) + '.json'
        fs.writeFileSync(outFile, JSON.stringify(jsons))
    }
    
}
else {
    throw 'No data file provided'
}
