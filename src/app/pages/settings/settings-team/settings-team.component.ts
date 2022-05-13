import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanysettingsResponse, CompanyTeam } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-team',
  templateUrl: './settings-team.component.html',
  styleUrls: ['./settings-team.component.scss']
})
export class SettingsTeamComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('teams') teams: CompanyTeam[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('teamModal', { static: false }) teamModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  activeTeams: CompanyTeam[] = [];
  dtOptions: DataTables.Settings = {};
  team: CompanyTeam = new CompanyTeam();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('teams');
    this.teams = this.settingsService.getCompanySettingsValue().teams;

    if (!this.teams) {
      this.teams = [];
    }
    this.setActiveTeams();
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        },
      ]
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  private delete = (item: CompanyTeam) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveTeams();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Teams', this.teams)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company team details successfully.');
          } else {
            this.toaster.success('Company team deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.teams = response.teams;
          this.setActiveTeams();
          
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isAdded = false;
    form.reset();
    this.isUpdating = false;
    this.team = new CompanyTeam();
    this.teamModal.showModal();
  }

  addOrUpdate() {
    const team = Object.assign({}, this.team);

    const activeOthers = this.activeTeams.filter(a =>
      team.teamId
        ? a.teamId !== team.teamId
        : a.tempId
          ? a.tempId !== team.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.team.trim().toLowerCase() === team.team.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {

      if (!this.isUpdating) {
        team.isActive = true;
        team.employeesCount = 0;
        team.tempId = ++this.tempId;
        this.teams.push(team);
        this.setActiveTeams();
      } else {
        if (team.teamId) {
          const addedTeam = this.teams.find(l => l.teamId === team.teamId);
          if (addedTeam) {
            addedTeam.team = team.team;
            addedTeam.description = team.description;
          }
        } else {
          const addedTeam = this.teams.find(l => l.tempId === team.tempId);
          if (addedTeam) {
            addedTeam.team = team.team;
            addedTeam.description = team.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.teamModal.hideModal();
    }
  }

  edit(item: CompanyTeam) {
    this.isAdded = false;
    this.isUpdating = true;
    this.team = Object.assign({}, item);
    this.teamModal.showModal();
  }

  setActiveTeams() {
    this.teams = this.teams.filter(i => i.teamId || (!i.teamId && i.isActive));
    this.activeTeams = this.teams.filter(i => i.isActive);
  }

  deleteAlert(item: CompanyTeam) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this team. You can delete a team only when there are no employees in the team.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Team?',
        content: [
          'When you delete a team, it will be removed from the list of all the teams and this action cannot be undone.',
          'Please click the save teams button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Team',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
