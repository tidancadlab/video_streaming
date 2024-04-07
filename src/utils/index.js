const path = require('path');
const { randomUUID } = require('crypto');
const { existsSync, mkdirSync } = require('fs');
const errors = require('../error');

const utils = {
  /**
   * @param {string} absolutePath
   */
  async createDirectory(absolutePath) {
    if (!existsSync(absolutePath)) {
      mkdirSync(absolutePath, { recursive: true });
    }
  },

  /**
   * @param  {...string} arg
   * @returns
   */
  joinPath(...arg) {
    const result = path.join(...arg);
    return result.replace(/\\/g, '/');
  },

  async generateIds(...rest) {
    return rest.reduce((total, v) => {
      const item = typeof total === 'object' ? total : { [total]: randomUUID() };
      return { ...item, [v]: randomUUID() };
    });
  },

  /**
 *
 * @param {Object<string, Array<string> | string> | Array<string | Array<string> >} paramTypes
 * @param {IArguments} params
 * @param {number} code
 * @example
 * const paramTypes = [['string', 'number'], ['string', 'number'], 'object', 'number', ['string', 'number'], 'number'];
    checkParameters(paramTypes, arguments);
 */
  checkParameters(paramTypes, params, code = 0) {
    let listErrors = '';
    let srNo = 0;
    for (const [paramName, expectedType] of Object.entries(paramTypes)) {
      let serialNumber = '';
      switch ((srNo += 1)) {
        case 1:
          serialNumber = '1st';
          break;
        case 2:
          serialNumber = '2nd';
          break;
        case 3:
          serialNumber = '3rd';
          break;
        default:
          serialNumber = `${srNo}th`;
          break;
      }
      if (expectedType instanceof Array) {
        if (!expectedType.includes(typeof params[paramName])) {
          if (listErrors.length === 0) {
            listErrors += '------- Following params have error ------- \n';
          }
          listErrors += `${serialNumber} argument must be one of the following types: [${expectedType.join(' or ')}], but it is ${params[paramName]}.\n`;
        }
        // eslint-disable-next-line valid-typeof
      } else if (typeof params[paramName] !== expectedType) {
        if (listErrors.length === 0) {
          listErrors += '------- Following params have error ------- \n';
        }
        listErrors += `${serialNumber} argument must be type of '${expectedType}', but it is ${params[paramName]}.\n`;
      }
    }
    if (listErrors.length > 0) {
      throw new errors.CustomError({ message: listErrors, name: 'no-params', code });
    }
  },
};

module.exports = utils;
