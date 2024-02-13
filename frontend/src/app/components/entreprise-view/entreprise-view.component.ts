import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { Entreprise } from 'src/app/shared/types/entreprise.type';

@Component({
  selector: 'app-entreprise-view',
  templateUrl: './entreprise-view.component.html',
  styleUrls: ['./entreprise-view.component.css']
})
export class EntrepriseViewComponent {
  private _entreprise : Entreprise;

  constructor(private _route: ActivatedRoute,
              private _entrepriseService: EntrepriseService,
              private _router: Router) {
                this._entreprise = {} as Entreprise;
              }


  ngOnInit() {
    // Get the 'siren' parameter from the route
    const siren = this._route.snapshot.paramMap.get('siren');
    if(siren){
        this._entrepriseService.getEntreprisesBySiren(siren).
        subscribe(
          (data) => {
            this._entreprise = data;
          }
        );
    }else{
      this._router.navigate(['/home']);
    }
  }

  get entreprise(): Entreprise {
    return this._entreprise;
  }

  set entreprise(value: Entreprise) {
    this._entreprise = value;
  }

}
