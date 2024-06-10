const { program } = require('commander')
const STRESS = require('../stress/dist/@alfredo-taboada/stress')
const fs = require('fs')

program.name('convert')
program.description(`Convert any known file format into a json proprietary format for tecto-stress.`)
program.version('0.1.0', '-v, --vers', 'output the current version');
program.requiredOption('-d, --data <string>', 'a data file to convert. Format can be csv... Refer to the documentation for more information')
program.parse()

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1)
}

function getBaseName(filename) {
    return filename.substring(0, filename.lastIndexOf('.'))
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
