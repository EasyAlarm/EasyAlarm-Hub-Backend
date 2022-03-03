import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document
{
    username: string;
    password: string;
}


const UserSchema = new mongoose.Schema
    ({
        username:
        {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
            trim: true,
            maxlength: [16, 'Username must have less or equal then 16 characters'],
            minlength: [3, 'Username must have more or equal then 3 characters']
        },
        password:
        {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8
        },
        date:
        {
            type: Date,
            default: Date.now
        }
    });

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;

