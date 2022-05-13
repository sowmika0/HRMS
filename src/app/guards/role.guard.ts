import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from './../shared/services/local-storage-service';

@Injectable({
    providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService
    ) {
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const userInfo = this.localStorageService.getLoggedInUserInfo();
        const roles = route.data.roles as Array<string>;
        if (userInfo && userInfo.token) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
        // if (userInfo && userInfo.token && (!roles || roles.find(r => r === userInfo.role))) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return false;
        // }
    }
}
