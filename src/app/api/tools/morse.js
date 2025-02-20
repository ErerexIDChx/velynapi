import {  CREATOR } from "../../../settings";
const morseDict = {
    'A': '•–', 'B': '–•••', 'C': '–•–•', 'D': '–••', 'E': '•',
    'F': '••–•', 'G': '––•', 'H': '••••', 'I': '••', 'J': '•–––',
    'K': '–•–', 'L': '•–••', 'M': '––', 'N': '–•', 'O': '–––',
    'P': '•––•', 'Q': '––•–', 'R': '•–•', 'S': '•••', 'T': '–',
    'U': '••–', 'V': '•••–', 'W': '•––', 'X': '–••–', 'Y': '–•––',
    'Z': '––••', '1': '•––––', '2': '••–––', '3': '•••––', '4': '••••–',
    '5': '•••••', '6': '–••••', '7': '––•••', '8': '–––••', '9': '––––•',
    '0': '–––––', '.': '•–•–•–', ',': '––••––', '?': '••––•–',
    '"': '•––••', '-': '−••••−', ';': '–•–•–•', '+': '•–•–•',
    '=': '–••••–', '!': '•–•–', '/': '–•••–', ' ': '/'
};
const morseToTextDict = Object.fromEntries(Object.entries(morseDict).map(([key, value]) => [value, key]));
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => morseDict[char] || '').join(' ');
}
function morseToText(morse) {
    return morse.split(' ').map(code => morseToTextDict[code] || '').join('');
}
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }
    const { input } = req.query;
    if (!input) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'input' tidak boleh kosong",
        });
    }
    const isMorse = input.trim().split(' ').every(code => morseToTextDict[code] !== undefined || code === '/');
    const result = isMorse ? morseToText(input) : textToMorse(input);
    return res.status(200).json({
        status: true,
        creator: CREATOR,
        input: input,
        output: result,
    });
  }
