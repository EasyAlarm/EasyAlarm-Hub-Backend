const codePoints = "0123456789abcdefghijklmnopqrstuvwxyz";

const numberOfValidInputCharacters = () =>
{
    return codePoints.length;
};

const codePointFromCharacter = (character: string) =>
{
    return codePoints.indexOf(character);
};

export default function validateCheckCharacter(input: string): boolean
{
    let factor = 1;
    let sum = 0;
    let n = numberOfValidInputCharacters();

    // Starting from the right, work leftwards
    // Now, the initial "factor" will always be "1"
    // since the last character is the check character.
    for (let i = input.length - 1; i >= 0; i--)
    {
        let codePoint = codePointFromCharacter(input.charAt(i));
        let addend = factor * codePoint;

        // Alternate the "factor" that each "codePoint" is multiplied by
        factor = (factor === 2) ? 1 : 2;

        // Sum the digits of the "addend" as expressed in base "n"
        addend = (Math.floor(addend / n)) + (addend % n);
        sum += addend;
    }
    let remainder = sum % n;
    return (remainder === 0);
}