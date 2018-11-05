import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'

import { AuthService } from '../auth/auth.service';

import { 
    NbUserService,
    NbProfileService,
    NbPopupsService,
    NbCustomSiteService,
    NbStuffService
} from '../nb-services';


import { NbProfile } from '../nb-models/nb-profile';
import { NbUser } from '../nb-models/nb-user';

import { 
    nbLoggedPages, 
    nbUnloggedPages, 
    nbDashboardPages, 
    PrivilegesOptions, 
    NbRoutes, 
    PopupsVars 
} from '../nb-config';

import * as fromNb from '../nb-store/nb.reducers'; 
import * as fromAuth from '../nb-store/auth/auth.reducers';
import * as NavbarActions from '../nb-store/navbar/navbar.actions';

@Component({
  selector: 'nb-navbar',
  templateUrl: './nb-navbar.component.html'
})
export class NbNavbarComponent implements OnInit {


    private _subscriptions: Subscription[] = [];
    
    public nbLoggedPages: string[] = nbLoggedPages;
    public nbUnloggedPages: string[] = nbUnloggedPages;
    public nbDashboardPages: string[] = nbDashboardPages;
    
    public NbRoutes = NbRoutes;
    
    userPrivileges: string[] = [];
    privilegesOptions = PrivilegesOptions;

    navbarState;
    NavTranslator;
    
    customNavbar;
    customNavbarCss;
    customNavLink;
    customNavLinkAnimations;    
  
    private _authService: AuthService;
    private _nbPopupsService:NbPopupsService;
    private _nbUserService:NbUserService;
    private _nbProfileService:NbProfileService;
    private _nbStuffService:NbStuffService;
    private _nbCustomSiteService:NbCustomSiteService;
    
    get isEditingCustomSite(){
        return this._nbCustomSiteService.isEditingCustomSite;
    }

    constructor(
        authService: AuthService,
        nbPopupsService:NbPopupsService,
        nbUserService:NbUserService,
        nbProfileService:NbProfileService,
        nbStuffService:NbStuffService,
        nbCustomSiteService:NbCustomSiteService,
        private _store:Store<fromNb.nbState>
        ) {
            this._authService = authService,
            this._nbPopupsService = nbPopupsService;
            this._nbUserService = nbUserService;
            this._nbProfileService = nbProfileService;
            this._nbStuffService = nbStuffService;
            this._nbCustomSiteService = nbCustomSiteService;
            //this._nbLangsService = nbLangsService;
         }

    user:NbUser;
    userProfile: NbProfile;

    lang: string;

    ngOnInit() {
                
        this.navbarState = this._store.select('navbar');

        this.setNavbar();
        
        this.navbarState
            .subscribe(navbarStat => {
                this.NavTranslator = navbarStat.translator;
            })

        this.setUser();
        

        this.setUserProfile();
        
    }

    private setNavbar(): void{
        this._subscriptions.push(

            this._nbCustomSiteService.getCustomNavbar()
                .subscribe(customNavbar => {

                    if (customNavbar){
                        this.customNavbar = customNavbar;
                        this.customNavbarCss = (customNavbar['css'] && customNavbar['css']['lg'] && customNavbar['css']['lg']['navBar']) ? customNavbar['css']['lg']['navBar'] : '';
                        this.customNavLink = (customNavbar['css'] && customNavbar['css']['lg'] && customNavbar['css']['lg']['navLink']) ? customNavbar['css']['lg']['navLink'] : '';
                        this.customNavLinkAnimations = (customNavbar['animations'] && customNavbar['animations']['navLink']) ? customNavbar['animations']['navLink'] : '';
                    }else{
                        this.customNavbar = '';
                        this.customNavbarCss = '';
                        this.customNavLink = '';
                    }
                })
        );
    }

    private setUser(): void{
        this._subscriptions.push(
            this._nbUserService.getLoggedUser()
                .subscribe((user:NbUser)=>{
                        if(user){
                            this.user = user;
                        }  
                    })
        );
    }

    private setUserProfile(): void {
        this._subscriptions.push(
            this._nbProfileService.getUserProfile()
                .subscribe(
                    (userProfile:NbProfile)=>{
                        this.userProfile = userProfile;
                        this.setUserPrivileges();

                    } 
                )
        );   
    }

    public changeUserProfile(profileId){

        this._subscriptions.push(  
            this._nbProfileService.setProfile({id:profileId}, 'user').subscribe()
        )

    }

    setUserPrivileges(): void{

        // TODO 

    }

    onNavClick(navItem: string): void{
        this._store.select('navbar').dispatch(new NavbarActions.SetActive(navItem));  
    }

    logout(): void{
        this._authService.logout();
    }


    ngOnDestroy(): void{
        this._subscriptions.forEach(subs => subs.unsubscribe())
    }

    onUploadPost(){
        this._nbStuffService.setNewStuffToEdit();
        this._nbPopupsService.openPopup(PopupsVars.editNewStuffPopupOptions);
    }

    onEditUserProfiles(){
        this._nbPopupsService.openPopup(PopupsVars.editUserProfilesPopupOptions);
    }
   
}
