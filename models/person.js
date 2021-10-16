const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const validateNumberLength = (numberString) => {
  // Remove all hyphens from number string
  const numberDigits = numberString.replace(/-/g, '');
  return numberDigits.length >= 8;
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    validate: {
      validator: validateNumberLength,
      message: 'Phone number must have at least 8 digits'
    },
    minLength: 8,
    required: true
  }
});

// Add unique constraint to person schema
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);