import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { SettingsSection, SettingsSections } from './settings.constant';
import { CompanysettingsResponse } from './settings.model';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('settingsTabs', { static: false }) settingsTabs: TabsetComponent;

  activeRoute = '';
  showHeaderContent = false;
  activeSection: SettingsSection;
  settingSections = SettingsSections.sections;
  settings: CompanysettingsResponse;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.activeRoute = this.router.routerState.root.snapshot.firstChild.firstChild
      ? this.router.routerState.root.snapshot.firstChild.firstChild.url[0].path
      : '';

    this.sortSections();
    this.getCompanySettings();
  }

  ngAfterViewInit() {
    this.activatedRoute.url.subscribe(event => {
      this.activeRoute = this.router.routerState.root.snapshot.firstChild.firstChild
        ? this.router.routerState.root.snapshot.firstChild.firstChild.url[0].path
        : '';
      this.setActiveSection();
    })
  }

  setActiveSection() {
    const section = this.settingSections.find(r => r.route === this.activeRoute);
    if (section) {
      this.activeSection = section;
    } else {
      this.activeSection = this.settingSections[0];
      this.router.navigate(['/settings/' + this.activeSection.route]);
    }
    this.settingsTabs.tabs[this.settingSections.indexOf(this.activeSection)].active = true;
  }

  sortSections() {
    this.settingSections = this.settingSections.sort((t1, t2) => {
      const name2 = t2.leftHeader.trim().toLowerCase();
      const name1 = t1.leftHeader.trim().toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    });
  }

  getCompanySettings() {
    this.subjectService.toggleLoading(true);
    this.settingsService.getCompanySettings()
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          this.settings = response;
          this.settingsService.setCompanySettingsValue(this.settings);
          this.setActiveSection();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  onTabChanged(section: SettingsSection) {
    this.router.navigate(['/settings/' + section.route]);
    this.subjectService.scrollToTop();
    this.activeSection = section;
  }

  toggleHeaderContent() {
    this.showHeaderContent = !this.showHeaderContent;
  }
}
