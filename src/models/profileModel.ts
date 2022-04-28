import mongoose from 'mongoose';

export interface ProfileDocument extends mongoose.Document
{
    unitIDS: any;
    name: string;
}

const ProfileSchema = new mongoose.Schema
    ({
        name:
        {
            type: String,
            required: true,
            minlength: 3,
        },

        unitIDS:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'unit'
                }
            ]
    });

const ProfileModel = mongoose.model('profile', ProfileSchema);
export default ProfileModel;