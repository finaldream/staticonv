/**
 * Path-related utilities.
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 07.03.2017
 */

'use strict';

const { join } = require('path');

const PathUtils = {

    pwd: () => process.env.PWD || process.cwd(),

    resolveModulePath: (mod) => {

        // Join relative paths with PWD
        if (mod.indexOf('./') === 0) {
            return join(PathUtils.pwd(), mod);
        }

        // Allows to require files from examples
        if (mod.indexOf('~') === 0) {
            return join(__dirname, '..', mod.substr(1));
        }

        // Absolute paths or module names
        return mod;

    },

};

module.exports = PathUtils;