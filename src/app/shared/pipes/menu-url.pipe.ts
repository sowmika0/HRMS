import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'menuurl'
})
export class MenuUrlPipe implements PipeTransform {
    transform(val: string): string {
        return val.replace(/\//g, '');
    }
}