/**
 *
 * Processes all files by running a custom converter against them.
 *
 * Options:
 *
 * logger: a winston compatible logger
 * converter: function(file: string, $: cheerio, data: object): {file: string, contents: Buffer|Array|String}
 *
 * The converter is required to return an object with "file" and "contents" keys set. If "file" contains a falsy value,
 * no data is written. This also allows to implement custom validations and control rejections.
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 01.03.2017
 */

'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');

/**
 * Converts various datatypes to a Buffer
 *
 * @param {Array|String|Object} contents
 * @return {Buffer}
 */
function contentsToBuffer(contents) {

    if (Buffer.isBuffer(contents)) {
        return contents;
    }

    if (Array.isArray(contents)) {
        return Buffer.from(contents);
    }

    if (_.isString(contents)) {
        return Buffer.from(contents, 'utf8');
    }

    return Buffer.from(JSON.stringify(contents, null, 2), 'utf8');

}

/**
 * Metalsmith middleware factory.
 *
 * @param {object} options
 * @param {*} options.logger Winston / console compatible logger
 * @param {function(file: string, $: cheerio, data: object): {file: string, contents: Buffer|Array|String}} options.converter Converter function
 * @return {function(files, metalsmith, done)}
 */
module.exports = function metalsmithHTMLExtrator(options) {

    const logger = options.logger || console;
    const converter = options.converter;

    return function (files, metalsmith, done) {


        setImmediate(done);

        Object.keys(files).forEach((file) => {

            const data = files[file];
            logger.info(`processing file ${file}`);

            delete files[file];

            const $ = cheerio.load(data.contents.toString());

            if (!converter) {
                return;
            }

            const result = converter(file, $, data);

            if (!result.file) {
                logger.info(`Skipping ${file}`);
                return;
            }

            file = result.file;
            files[file] = {};
            files[file].contents = contentsToBuffer(result.contents);

        });

    };

};


