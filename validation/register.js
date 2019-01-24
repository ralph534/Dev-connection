const validator = require('validator')
import isEmpty from ('./is-empty')

module.exports = validateRegisterInput = (data) => {
  let error = {};

  if(!validator.length(data.name, {min: 2, max: 30})){
    errors.name = 'Name must be between 2 and 30 characters'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
