/**
 * Main module entry-point
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 02.03.2017
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const fsj = require('fs-jetpack');
const Metalsmith = require('metalsmith');
const htmlExtractor = require('./metalsmith-html-extractor');
const PathUtils = require('./path-utils');

const FILE_PATTERN = /\.(htm|html)$/;


/**
 *
 * @param {Object} args
 * @param {string} args.input
 * @param {string} [args.output = './output']
 * @param {function} args.converter
 * @param {*} [args.logger = console]
 */
module.exports = function runCommand(args) {

    const input = args.input;
    const output = args.output || './output';
    const logger = args.logger || console;
    const pwd = PathUtils.pwd();

    if (!_.isFunction(args.converter)) {
        throw Error('Converter must be a function');
    }

    if (!fsj.exists(input)) {
        logger.error(`Error: Input folder "${input}" does not exist.`);
        return;
    }

    fsj.dir(output, {empty: true});

    // Options are passed to the htmlExtractor-plugin
    const extractorOptions = {
        args: {
            pwd,
            input,
            output: path.join(pwd, output),
        },
        logger,
        converter: args.converter,
    };

    const ms = new Metalsmith(pwd)
        .source(input)
        .destination(output)
        .concurrency(100)
        .frontmatter(false) // disable YAML-parsing
        .ignore((file, stats) => (stats.isFile() && !FILE_PATTERN.test(file))) // ignores all files NOT matching FILE_PATTERN
        .use(htmlExtractor(extractorOptions));

    ms.build((err, files) => {
        if (err) {
            logger.error(`Error: ${err}`);
            return;
        }

        logger.info(`Processed ${Object.keys(files).length} files.`);
    })


};