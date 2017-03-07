# Staticonv - Static Site Converter

Takes a folder of static site files and processes them in a predefined manner.
(TODO: proper modularization is to be implemented)

## References

Links:

* https://www.npmjs.com/package/staticonv
* https://github.com/finaldream/staticonv

Based on:

* [Metalsmith - Static site Generator](http://www.metalsmith.io/)
* [Cheerio - headless jQuery implementation](https://github.com/cheeriojs/cheerio)
* [Caporal - CLI framework](https://www.npmjs.com/package/caporal)

## Installation

```bash
npm install -g staticonv
```

## Command Line Interface

See `staticonv help` for CLI-options.

```
staticonv 0.1.1

   USAGE

     staticonv convert <converter> <input> <output>

   ARGUMENTS

     <converter>      Module that exports a function in the form of                                                            required
                      function(file: string, $: cheerio, data: object): {file: string, contents: any}
                      Modules are loaded by normal require(), with a few exceptions:
                      - starting with "./" is relative to current work-dir, not the module's JS-files
                      - starting with "~" is relative to the staticonv-module, which allows to use the example-converters

     <input>          Input folder                                                                                             required
     <output>         Output folder, always relative to PWD!                                                                   required

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

Example:

```bash
staticonv convert ~examples/json-converter /path/to/sources/ output
```

## Using as node-module

You can require `staticonv` as a module and call it programmatically:

```js
const staticonv = require('staticonv');

staticonv({
    input: 'input path',
    output: 'output path',
    converter: function (file, $, data) { 
        // ...
        return {
            file: file,
            contents: {
                // ...
            }
        };
    },
    logger: winston || console || null,
});

```

## Converter modules

Converters are simple modules which export a single function. This function is called once per file and allows to 
extract data based on the DOM-abstration provided by [Cheerio](https://github.com/cheeriojs/cheerio).

The function takes the following arguments:

* **file: string** the current filename (path based on `input`)
* **$: cheerio** Cheerio DOM-abstration, provides a similar interface like jQuery.
* **data: object** additional data, like a buffer providing access to the raw data. 

It is expected to return an object in the shape of:

* *file: string* repesents the new file name, where the converted data is written. If `null`, the file will be ignored

## Examples

See folder `/examples`. You can run example-converters by prefixing the path with a `~`, e.g. 

```bash
staticonv convert ~examples/json-converter input output
```

## Author

**Oliver Erdmann**

* [Oliver Erdmann](https://github.com/olivererdmann)
* [github.com/finaldream](https://github.com/finaldream)
* [finaldream.de](http://www.finaldream.de)

## License

Copyright © 2017, [Oliver Erdmann](https://github.com/olivererdmann).
Released under the [MIT license](https://github.com/finaldream/staticonv/blob/master/LICENSE).