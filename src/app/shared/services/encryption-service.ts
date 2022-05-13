import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable()
export class EncryptionService {
    constructor(
    ) {
    }

    encryptData(data) {
        const encryptSettings = environment.storageEncryption;
        try {
            if (encryptSettings.encrypt && data) {
                return CryptoJS.AES.encrypt(JSON.stringify(data), encryptSettings.key).toString();
            }
            else {
                return data;
            }
        } catch (e) {
            console.log(e);
        }
    }

    decryptData(data) {
        const encryptSettings = environment.storageEncryption;
        try {
            if (encryptSettings.encrypt && data) {
                const bytes = CryptoJS.AES.decrypt(data, encryptSettings.key);
                if (bytes.toString()) {
                    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                }
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }

}
