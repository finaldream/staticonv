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

    const inputDir = args.input;
    const outputDir = args.output || './output';
    const logger = args.logger || console;
    const pwd = PathUtils.pwd();

    if (!_.isFunction(args.converter)) {
        throw Error('Converter must be a function');
    }

    if (!fsj.exists(inputDir)) {
        logger.error(`Error: Input folder "${inputDir}" does not exist.`);
        return;
    }

    fsj.dir(outputDir, {empty: true});

    // Options are passed to the htmlExtractor-plugin
    const extractorOptions = {
        logger,
        converter: args.converter,
    };

    const ms = new Metalsmith(pwd)
        .source(inputDir)
        .destination(outputDir)
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