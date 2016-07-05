var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'xereda';
const someOtherPlaintextPassword = 'not_xereda';

const hash = "$2a$10$FRahmHeaMTIdMS8bvdr/hu3Pv.mwMgfIuAOs8LeCfnMLeUEmz1aQC";

//var hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

// Load hash from your password DB.
console.log("essa senha eh valida " + bcrypt.compareSync(myPlaintextPassword, hash)); // true
console.log("senha invalida: " + bcrypt.compareSync(someOtherPlaintextPassword, hash)); // false
