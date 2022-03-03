export default class Unit
{
    private id: string;
    private type: string;
    private nodeAddress: string;

    constructor(id: string, type: string, nodeAddress: string)
    {
        this.id = id;
        this.type = type;
        this.nodeAddress = nodeAddress;
    }

    public getId(): string
    {
        return this.id;
    }

    public getType(): string
    {
        return this.type;
    }

    public getNodeAddress(): string
    {
        return this.nodeAddress;
    }
}