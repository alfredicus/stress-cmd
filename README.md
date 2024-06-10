# stress-cmd

Allows to perform a stress inversion using the command line.

This app is based on the [stress library](https://github.com/alfredicus/stress).

## Usage:

```sh
node invert.js --help
node invert.js --vers
node invert.js jsonFile
```

## Json configuration file
```json
{
    "dataset": [
        {
            "file": "stylos/stylolites-1.json",
            "weight": 0.83, // optional, default 1
            "active": true // optional, default true
        },
        ...
    ],
    "options": {
        "searchMethod": {
            "name": "Monte Carlo",
            "nbIter": 50000
        },
        "stressRatio": {
            "min": 0.7,
            "max": 0.9
        }
    }
}
```

### When at the root of this folder
```sh
node invert.js ./data/matelles/model.json
```

### In the 'matelles‘ folder
```sh
node ../../invert.js model.json
```

<br><br><br>

## Generate a executable from node
See [this page](https://nodejs.org/api/single-executable-applications.html)
