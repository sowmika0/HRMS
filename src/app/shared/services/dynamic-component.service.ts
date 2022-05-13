import { CommonModule } from '@angular/common';
import { Compiler, Component, Injectable, NgModule, ViewChild, ViewContainerRef } from '@angular/core';

import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { SharedModule } from '../shared.module';
import { CustomNotificationService } from './custom-notification.service';
import { CustomToastrService } from './toastr.service';

// import { LoremIpsum } from 'src/app/app.constants';

@Injectable()
export class DynamicComponentService {

    constructor(
        private _compiler: Compiler
    ) {
    }

    dynamicComponentSelector = 'app-dynamic-component-selector';

    private createComponent(content: string) {
        @Component({
            selector: this.dynamicComponentSelector,
            template: content,
        })
        class DynamicComponent {
            @ViewChild('sampleModal', { static: false }) sampleModal: CustomModalComponent;

            // loremIpsum = LoremIpsum;
            loopItems = [1, 2, 3, 4, 5];
            modalSize = 'md';

            items1 = [
                'Windstorm',
                'Bombasto',
                'Magneta',
                'Tornado'
            ];

            items2 = [
                'Apple',
                'Mango',
                'Orange',
                'Banana'
            ];

            items3 = ['Mr. O', 'Tomato'];

            items4 = [];

            constructor(
                private toastr: CustomToastrService,
                private notificationService: CustomNotificationService,

            ) {

            }

            showToastrMessage(type: string, title: string, message: string, toastrType: string) {
                switch (toastrType) {
                    case 'default':
                        this.toastr.showDefaultToastr(type, title, message);
                        break;
                    case 'ks-default':
                        this.toastr.showKsToastr(type, title, message);
                        break;
                    case 'ks-custom':
                        this.toastr.showCustomKsToastr(type, title, message);
                        break;
                }

            }

            showModal(modalSize: string) {
              this.modalSize = modalSize;
              this.sampleModal.showModal();
            }

            undoCallback(params: any) {
                alert('Undo callback called with parameter - ' + JSON.stringify(params));
            }

            showNotification(
                type: string,
                title: string,
                message: string,
                showUndo: boolean,
                undoCallback: any,
                undoParams: any
            ) {
                this.notificationService.showNotification(
                    type,
                    title,
                    message,
                    new Date(),
                    showUndo,
                    undoCallback,
                    undoParams
                );
            }

            modalSuccessButton() {
                this.sampleModal.hideModal();
            }
        };
        return DynamicComponent;
    }

    private createComponentModule(componentType: any) {
        @NgModule({
            imports: [
                CommonModule,
                SharedModule
            ],
            declarations: [
                componentType
            ],
        })
        class DynamicModule {
        }
        return DynamicModule;
    }

    async renderComponentTemplate(template: string, view: ViewContainerRef, inputs: any[]) {
        const component = this.createComponent(template);
        const dynamicModule = this.createComponentModule(component);

        return this._compiler.compileModuleAndAllComponentsAsync(dynamicModule)
            .then((factories) => {
                const componentFactory = factories.componentFactories.find(f => f.selector === this.dynamicComponentSelector);
                const componentRef = view.createComponent(componentFactory);
                return componentRef;
            });
    }
}