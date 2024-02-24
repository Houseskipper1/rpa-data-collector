import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParameterService } from 'src/app/shared/services/parameter.service';
import { Parameter } from 'src/app/shared/types/parameter.type';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styleUrls: ['./parameters-list.component.css'],
})
export class ParametersListComponent implements OnInit {
  private _parameters: Parameter[];
  private _parameterEditDialog:
    | MatDialogRef<DialogComponent, Event>
    | undefined;

  constructor(
    private _parameterService: ParameterService,
    private _dialog: MatDialog
  ) {
    this._parameters = [];
  }

  ngOnInit(): void {
    this._parameterService.getParameters().subscribe((data) => {
      this._parameters = data;
    });
  }

  get parameters(): Parameter[] {
    return this._parameters;
  }

  set parameters(value: Parameter[]) {
    this._parameters = value;
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600) % 24;
    const days = Math.floor(seconds / (3600 * 24)) % 30;
    const months = Math.floor(seconds / (3600 * 24 * 30)) % 12;
    const years = Math.floor(seconds / (3600 * 24 * 30 * 12));

    const parts = [];
    if (years > 0) parts.push(`${years} année${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mois`);
    if (days > 0) parts.push(`${days} jour${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds % 60 > 0)
      parts.push(`${seconds % 60} seconde${seconds % 60 > 1 ? 's' : ''}`);

    return parts.join(' ');
  }

  editParameter(parameter: Parameter) {
    this._parameterEditDialog = this._dialog.open(DialogComponent, {
      width: '600px',
      height: '520px',
      disableClose: true,
      data: {
        isUpdating: true,
        parameter: parameter,
      },
    });
    /*
    this._parameterEditDialog.afterClosed().pipe(
      filter((event: Event | undefined) => !!event),
      map((event: Event | undefined) => {
        if (event) {
          const { userId, dateCreated, dateUpdated, ...newEvent } = event;
          return newEvent as Event;

        } else {
          return undefined;
        }
      }),
      mergeMap((event: Event | undefined) => this._eventService.update(event as Event))
    ).subscribe(result => {
          this._eventService.fetchByUserId(this.user.id).subscribe(
            { next: (events: Event[]) =>
              {
                this.eventList = events
                this.eventArraySlice(this.currentPage)
              }
            }
          )
        }
    );
  */
  }
}
