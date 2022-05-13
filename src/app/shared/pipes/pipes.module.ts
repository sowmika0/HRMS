import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuUrlPipe } from './menu-url.pipe';

@NgModule({
    declarations: [
        MenuUrlPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MenuUrlPipe
    ]
})
export class PipesModule { }
