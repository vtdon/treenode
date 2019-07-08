/**
 * Treenode.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
      nodeIdentifier: {
        type: 'string',
        unique: true
      },
      parentNode: {
        model: 'treenode',
      },
      rootNode: {
        model: 'treenode',
      },
      nodeHeight: {
        type: 'number'
      },
      childrenNodes: {
        type: 'json',
        columnType: 'array',
        required: false
      }

  },

};

