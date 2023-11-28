// hooks mongoose
export const handleSaveError = (error, data, next) => {
  error.status = 400;
  console.log(data, error);
  console.log(this.options);

  next();
};

export const preUpdate = (error, data, next) => {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};