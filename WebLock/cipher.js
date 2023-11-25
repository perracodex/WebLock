/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

/**
 * Very simple and naive cipher method to encrypt/decrypt the pin.
 * is isn't really necessary, and is done only as simple protection against
 *  the possibility of external malware that could steal extension passwords, in which
 * case even if the extension pin isn't that important, by encrypting it we are 
 * adding some layer of protection for the scenario in which the user is actually
 * reusing an important password as the pin.
 */
export function cipher(input) {
    if (typeof input !== 'string' || input.length === 0) {
        return input;
    }

    const dataLength = input.length;
    const pseudoKey = String(dataLength % 100).charCodeAt(0);
    const output = Array.from(input).map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ pseudoKey)
    );

    return output.join("");
}
