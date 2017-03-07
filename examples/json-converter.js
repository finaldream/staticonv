/**
 * Sample HTML to JSON converter
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 03.03.2017
 */

'use strict';

const path = require('path');
const _ = require('lodash');
const striptags = require('striptags');

const allowedTags = ['p', 'a', 'strong', 'em', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h5', 'ul', 'ol', 'li'];

function cleanContent(content) {

    if (!content || !content.length) {
        return '';
    }

    let result = striptags(content, allowedTags);

    // String clean-up
    result = result.replace(/(\r|\n|\t)/g, '');
    result = result.replace(/<!--[\s\S]*?-->/g, '');

    return result;
}

/**
 * Converter, called for each single file. Runs the custom logic for a migration.
 *
 * @param {string} file
 * @param {cheerio} $
 * @param {Object} data
 * @param {Buffer} data.contents
 *
 * @return {{file:string, contents: any}}
 */
module.exports = function jsonConverter(file, $, data) {

    const fileParts = path.parse(file);

    if (fileParts.name.indexOf('_') === 0) {
        return {};
    }

    const title = $('title').text() || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const content = cleanContent($('body').html());

    // return null, if you don't want to write an output-file.
    const newFile = file.replace(/html?$/i, 'json');

    return {
        file: newFile,
        contents: {
            title,
            keywords,
            description,
            content,
        }
    };

};