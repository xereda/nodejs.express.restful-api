const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const liveSchema = new Schema({ name: String }, { toJSON: { getters: true } })
mongoose.connect('mongodb://localhost/docmob')
console.log(mongoose.models)
const model = mongoose.model('Live', liveSchema)
const _handle = model.find({}, { name: 1 })
_handle.sort()
_handle.limit(1).skip(0)
_handle.lean()
_handle.exec((err, lives) => {
  console.log(lives)
});
