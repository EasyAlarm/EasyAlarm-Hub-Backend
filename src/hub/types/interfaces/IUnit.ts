import { ObjectId } from 'mongodb';


export interface IUnit 
{
    _id: ObjectId;
    deviceID: string;
    type: string;
    nodeAddress: string;
    friendlyName: string;
    online: boolean;
}