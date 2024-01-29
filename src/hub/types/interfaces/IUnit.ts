import { ObjectId } from 'mongodb';
import UnitType from '../enums/unitType';


export interface IUnit 
{
    _id: ObjectId;
    deviceID: string;
    type: UnitType;
    nodeAddress: string;
    friendlyName: string;
    online: boolean;
}