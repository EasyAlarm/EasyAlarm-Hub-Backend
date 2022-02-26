import { object, string, TypeOf } from "zod";
import validateCheckCharacter from "../utils/luhnValidator";

export const createUnitSchema = object({
    body: object({
        friendlyName: string({
            required_error: "Name is required"
        }),
        unitID: string({
            required_error: "Unit ID is required"
        }).length(6, "Unit ID must be 6 characters long"),
    }).refine((data) => validateCheckCharacter(data.unitID), {
        message: "Invalid Unit ID"
    })
});

export type CreateUnitInput = TypeOf<typeof createUnitSchema>;

