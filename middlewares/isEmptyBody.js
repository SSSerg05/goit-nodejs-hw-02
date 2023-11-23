import HttpError from "../helpers/HttpError.js";

export const isEmptyBody = () => {
  const keys = Object.keys()
  if(!keys.length) {
    return next(HttpError(400, "Body empty. Its must have fields"));
  }
  next()
}

export default isEmptyBody