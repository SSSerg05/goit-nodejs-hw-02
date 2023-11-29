// hooks mongoose
export const handleSaveError = (error, data, next)=> {
  const {code, name, status} = error;
  status = 400;
  next();
}

export const preUpdate = function(next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
}