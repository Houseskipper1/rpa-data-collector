import { Component, OnInit, makeStateKey } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParameterService } from 'src/app/shared/services/parameter.service';
import { Parameter } from 'src/app/shared/types/parameter.type';
import { DialogComponent } from '../dialog/dialog.component';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styleUrls: ['./parameters-list.component.css'],
})
export class ParametersListComponent implements OnInit {
  private _parameters: Parameter[];
  private _parameterEditDialog:
    | MatDialogRef<DialogComponent, Parameter>
    | undefined;

  constructor(
    private _parameterService: ParameterService,
    private _dialog: MatDialog
  ) {
    this._parameters = [];
  }

  ngOnInit(): void {
    this._parameterService
      .getParameters()
      .pipe(
        map((parameters) =>
          parameters.map((parameter) => this.completeFields(parameter))
        )
      )
      .subscribe((data) => {
        this._parameters = data;
      });
  }

  get parameters(): Parameter[] {
    return this._parameters;
  }

  set parameters(value: Parameter[]) {
    this._parameters = value;
  }

  formatTime(parameter: Parameter): string {
    const seconds = parameter.second;
    const minutes = parameter.minute;
    const hours = parameter.hour;
    const days = parameter.day;
    const months = parameter.month;
    const years = parameter.year;
    const parts = [];

    if (years > 0) parts.push(`${years} année${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mois`);
    if (days > 0) parts.push(`${days} jour${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} seconde${seconds > 1 ? 's' : ''}`);

    return parts.join(' ');
  }

  completeFields(parameter: Parameter): Parameter {
    parameter.second = Math.floor(parameter.refreshFrequency / 1000);
    parameter.minute = Math.floor(parameter.second / 60) % 60;
    parameter.hour = Math.floor(parameter.second / 3600) % 24;
    parameter.day = Math.floor(parameter.second / (3600 * 24)) % 30;
    parameter.month = Math.floor(parameter.second / (3600 * 24 * 30)) % 12;
    parameter.year = Math.floor(parameter.second / (3600 * 24 * 30 * 12));
    parameter.second = parameter.second % 60;
    return parameter;
  }

  editParameter(parameter: Parameter): void {
    this._parameterEditDialog = this._dialog.open(DialogComponent, {
      width: '600px',
      height: '520px',
      disableClose: true,
      data: {
        isUpdating: true,
        parameter: parameter,
      },
    });

    this._parameterEditDialog
      .afterClosed()
      .pipe(
        filter((parameter) => !!parameter),
        mergeMap((parameter) => {
          if (parameter) {
            parameter.refreshFrequency = this.computeMilliseconds(
              parameter?.year ?? 0,
              parameter?.month ?? 0,
              parameter?.day ?? 0,
              parameter?.hour ?? 0,
              parameter?.minute ?? 0,
              parameter?.second ?? 0
            );
          }
          return this._parameterService.update(parameter as Parameter);
        })
      )
      .subscribe(
        (result) => {
          this._parameters = [];
          this.fetchAll();
        },
        (error) => {
          console.error(
            'Une erreur est survenue lors de la mise à jour du paramètre :',
            error
          );
        }
      );
  }

  fetchAll(): void {
    this._parameterService
      .getParameters()
      .pipe(
        map((parameters) =>
          parameters.map((parameter) => this.completeFields(parameter))
        )
      )
      .subscribe(
        (data) => {
          this._parameters = data;
        },
        (error) => {
          console.error(
            'Une erreur est survenue lors de la récupération des paramètres :',
            error
          );
          // Gérez l'erreur ici selon vos besoins
        }
      );
  }

  private computeMilliseconds(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ): number {
    return (
      years * 365 * 24 * 60 * 60 * 1000 +
      months * 30 * 24 * 60 * 60 * 1000 +
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000
    );
  }
}
