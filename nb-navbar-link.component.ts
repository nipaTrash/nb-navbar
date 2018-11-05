import { Component, Input } from '@angular/core';

import { btnHoverFadeStateTrigger, btnHoverZoomStateTrigger } from '../nb-animations/button-animations';

@Component({
    selector:'nb-navbar-link',
    templateUrl:'./nb-navbar-link.component.html',
    styles:[`
        :host{
            cursor: pointer;
            text-transform: capitalize;
        }
    `],
    animations: [
        btnHoverFadeStateTrigger,
        btnHoverZoomStateTrigger
    ]
})
export class NbNavbarLinkComponent{
    @Input() nameDspl;
    @Input() customCss;
    @Input() customAnimations;

}