import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
      username: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      lowercase: true,
      minlength: 3,
      maxlength: 25
    },
    password: {
        type: String,
        required: true,
        minLength: 6

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true,
        match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address"
    ]

    },
    passwordResetToken: {
        type: String
    },

    passwordResetExpires: {
        type: Date
    }
    },
    {
        timestamps: true
    }
)

//before saving any password we have to hash it
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password
userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}
export const User= mongoose.model("User", userSchema);