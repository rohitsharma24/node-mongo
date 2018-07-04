const jwt = require('jsonwebtoken');
const time = new Date().getTime();
var token1 =  jwt.sign({exp: (new Date().getTime()/1000) + 60}, 'abc123').toString();
const token2 = jwt.sign({nbf: (new Date().getTime()/1000) + 60, exp: (new Date().getTime()/1000) + 120,}, 'abc123').toString();
console.log(token1);