import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {
    constructor(
    ) {
    }
    convertHexToRgba(hex: string, opacity: number): string {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    shadeColor(color: string, percent: number) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = parseInt(((R * (100 + percent)) / 100).toString(), 2);
        G = parseInt(((G * (100 + percent)) / 100).toString(), 2);
        B = parseInt(((B * (100 + percent)) / 100).toString(), 2);

        R = R < 255 ? R : 255;
        G = G < 255 ? G : 255;
        B = B < 255 ? B : 255;

        const RR =
            R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
        const GG =
            G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
        const BB =
            B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

        return '#' + RR + GG + BB;
    }
}
