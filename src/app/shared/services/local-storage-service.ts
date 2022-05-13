import { EncryptionService } from './encryption-service';
import { Injectable } from '@angular/core';
import { LocalStorageItems } from '../../app.constants';
import { UserStorageInformation } from '../../app.model';

@Injectable()
export class LocalStorageService {
    constructor(
        private encryptionService: EncryptionService
    ) { }

    clearAllLocalStorageItems() {
        window.localStorage.clear();
    }

    setLoggedInUserInfo(userInfo: UserStorageInformation) {
        this.setLocalStorageItem(LocalStorageItems.userInformation, this.encryptionService.encryptData(userInfo));
    }

    getLoggedInUserInfo(): UserStorageInformation {
        const userInfo: UserStorageInformation = this.getLocalStorageItem(
            LocalStorageItems.userInformation
        );
        return this.encryptionService.decryptData(userInfo);
    }

    private getLocalStorageItem(itemName: string) {
        if (
            window.localStorage.getItem(itemName) !== null &&
            window.localStorage.getItem(itemName) !== undefined &&
            window.localStorage.getItem(itemName) !== ''
        ) {
            return JSON.parse(window.localStorage.getItem(itemName));
        }
    }

    private setLocalStorageItem(itemName: string, item: any) {
        window.localStorage.setItem(itemName, JSON.stringify(item));
    }

}
