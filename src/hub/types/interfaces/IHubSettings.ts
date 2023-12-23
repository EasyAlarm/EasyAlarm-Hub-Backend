export interface IAlarmSettings
{
    armDelay: number;
    alarmDelay: number;
    alarmDuration: number;
    alarmOnOfflineUnit: boolean;
}

export interface IPingerSettings
{
    shouldPing: boolean;
    globalPingInterval: number;
    betweenPingsInterval: number;
}
