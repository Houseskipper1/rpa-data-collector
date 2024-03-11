import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Parameter } from 'src/app/shared/types/parameter.type';

@Component({
  selector: 'app-edit-parameter',
  templateUrl: './edit-parameter.component.html',
  styleUrls: [],
})
export class EditParameterComponent implements OnInit {
  private readonly _cancel$: EventEmitter<void>;
  private readonly _submit$: EventEmitter<Parameter>;
  private _model: Parameter;
  parameterForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this._model = {} as Parameter;
    this._submit$ = new EventEmitter<Parameter>();
    this._cancel$ = new EventEmitter<void>();
  }
  ngOnInit(): void {
    this.parameterForm = new FormGroup({
      year: new FormControl(
        this.model.year,
        Validators.compose([Validators.required])
      ),
      month: new FormControl(
        this.model.month,
        Validators.compose([Validators.required])
      ),
      day: new FormControl(
        this.model.day,
        Validators.compose([Validators.required])
      ),
      hour: new FormControl(
        this.model.hour,
        Validators.compose([Validators.required])
      ),
      minute: new FormControl(
        this.model.minute,
        Validators.compose([Validators.required])
      ),
      second: new FormControl(
        this.model.second,
        Validators.compose([Validators.required])
      ),
    });
  }

  /**
   * Sets private property _model
   */
  @Input()
  set model(model: Parameter) {
    this._model = model;
  }

  /**
   * Returns private property _model
   */
  get model(): Parameter {
    return this._model;
  }

  /**
   * Returns private property _cancel$
   */
  @Output('cancel')
  get cancel$(): EventEmitter<void> {
    return this._cancel$;
  }

  /**
   * Returns private property _submit$
   */
  @Output('submit')
  get submit$(): EventEmitter<Parameter> {
    return this._submit$;
  }

  cancel(): void {
    this._cancel$.emit();
  }

  submit(parameter: Parameter): void {
    this._model.year = parameter.year;
    this._model.month = parameter.month;
    this._model.day = parameter.day;
    this._model.hour = parameter.hour;
    this._model.minute = parameter.minute;
    this._model.second = parameter.second;
    this._submit$.emit(this._model);
  }
}
