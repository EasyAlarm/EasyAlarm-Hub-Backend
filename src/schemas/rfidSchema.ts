import { object, string, TypeOf } from "zod";

export const addRfidCardSchema = object({
    body: object({
        passcode: string({
            required_error: "Passcode is required"
        }).length(3, "Rfid passcode must be 3 characters long"),
    })
});

export type AddRfidCardInput = TypeOf<typeof addRfidCardSchema>;