import fs from 'fs';
import readline from 'readline';
import { ROCKYOU_PATH } from '../config.js';

export async function isCommonPassword(password) {
    const fileStream = fs.createReadStream(ROCKYOU_PATH);
    const rl = readline.createInterface({
        input: fileStream, crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.trim() === password) {
            rl.close();
            return true; // 
        }
    }

    return false;
}