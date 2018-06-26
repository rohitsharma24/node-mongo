const {mongoose} = require('../DB/mongoose');
const {Todo} = require('../DB/models/todos');

Todo.findByIdAndRemove('5b2ffbdb2e00436a39083164').then(docs => console.log(docs)).catch(e => console.log('from error', e));
