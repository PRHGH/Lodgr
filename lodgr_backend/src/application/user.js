import User from "../infrastructure/entities/User.js";
import ValidationError from "../domain/errors/validation-error.js";

export const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    if (
      !userData.fname ||
      !userData.lname ||
      !userData.email ||
      !userData.address ||
      !userData.address.line_1 ||
      !userData.address.city ||
      !userData.address.country ||
      !userData.address.zip
    ) {
      throw new ValidationError("Invalid user data");
    }

    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
