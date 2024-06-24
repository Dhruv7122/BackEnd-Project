import mongoose , {Document,Schema} from "mongoose";
import bcrypt from "bcryptjs";
// User Type--
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword: (enteredPassword: string) => boolean;
  }
  // --UserSchema
  const userSchema = new Schema<IUser>({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
// Before Save Check For Passwod Is Modified Or Not
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    // Hash The Password
    this.password = await bcrypt.hash(this.password, salt);
  });
// Method for compare password HashPasword and Row Password
  userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  const User = mongoose.model("User", userSchema);

export default User;

  
  