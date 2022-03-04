import { getAllUnits } from "../services/unitService";

export default async function getNextNodeAddr(): Promise<string>
{
    const unitModels = await getAllUnits();

    unitModels.sort((a: any, b: any) => a.nodeAddress.localeCompare(b.nodeAddress));

    let smallestNum: number = 2;

    for (let i = 0; i < unitModels.length; i++)
    {
        if (unitModels[i].nodeAddress !== String(smallestNum))
        {
            return String(smallestNum);
        }

        smallestNum++;
    }

    return String(smallestNum);
}