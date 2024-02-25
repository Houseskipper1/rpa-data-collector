import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Parameter } from 'src/app/shared/types/parameter.type';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  _parameter!: Parameter;

  constructor(private _dialogRef: MatDialogRef<DialogComponent,Parameter>,
              @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
    this._parameter = data.parameter;
  }

  get parameter(): Parameter {
    return this._parameter;
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  onSave(parameter: Parameter): void{
    this._dialogRef.close(parameter);
  }
}
