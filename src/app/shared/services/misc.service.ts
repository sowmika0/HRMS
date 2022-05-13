import { Injectable } from '@angular/core';

@Injectable()
export class MiscService {
    constructor(
    ) {
    }

    removeSpaces<T>(value: any) {

        if (value !== undefined && value !== null) {
            if (value instanceof Array) {
                this.loopArray(value);
            }
            else if (value instanceof Object) {
                this.loopObject(value);
            }
            else if (typeof value === "string") {
                value = value.trim();
            }
        }
        return value;
    }

    private loopArray<T>(val: Array<T>) {
        for (let index in val) {
            let value: any = val[index];
            val[index] = this.removeSpaces(value);
        }
    }

    private loopObject<T>(val: T) {
        const objectKeys = Object.keys(val) as Array<keyof T>;

        for (let objKey of objectKeys) {
            let value = val[objKey];

            val[objKey] = this.removeSpaces(value);
        }
    }
}