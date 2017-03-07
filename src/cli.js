#!/usr/bin/env node

/**
 * Staticonv Command Line Interface
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 02.03.2017
 */

'use strict';

const _ = require('lodash');
const cli = require('caporal');
const packageJson = require('../package.json');
const main = require('./main');
const PathUtils = require('./path-utils');


const STR_ARG_CONVERTER = `Module that exports a function in the form of
function(file: string, $: cheerio, data: object): {file: string, contents: any}
Modules are loaded by normal require(), with a few exceptions:
- starting with "./" is relative to current work-dir, not the module's JS-files
- starting with "~" is relative to the staticonv-module, which allows to use the example-converters
- all other paths are either interpreted as absolute or module-paths.
`;

cli
    .version(packageJson.version)
    .command('convert')
    .argument('<converter>',
        STR_ARG_CONVERTER,
        arg => {
            const mod = PathUtils.resolveModulePath(arg);
            return require(mod);
        },
        undefined,
        true
    )
    .argument('<input>', 'Input folder')
    .argument('<output>', 'Output folder (always relative to PWD).')
    .action((args, options, logger) => {

        main({
            input: args.input,
            output: args.output,
            converter: args.converter,
            logger,
        });
    });

cli.parse(process.argv);
