import { Component, OnInit } from '@angular/core';
import { SireneEntrepriseService } from 'src/app/shared/services/sirene-entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-siren-entreprises-list',
  templateUrl: './siren-entreprises-list.component.html',
  styleUrls: ['./siren-entreprises-list.component.css']
})
export class SirenEntreprisesListComponent implements OnInit {
  private _sireneEntreprises: SireneEntreprise[];
  private _currentSireneEntreprisesToShow: SireneEntreprise[];
  private _pageSize;

  constructor(private _sireneEntrepriseService: SireneEntrepriseService){
    this._sireneEntreprises = [];
    this._currentSireneEntreprisesToShow = [];
    this._pageSize = 10;
  }

  ngOnInit(): void {
    this._sireneEntrepriseService.getSireneEntreprises().subscribe((sireneEntreprises) => {
      this._sireneEntreprises = sireneEntreprises;
      this._currentSireneEntreprisesToShow = this._sireneEntreprises.slice(0, this._pageSize);
      console.log(this._currentSireneEntreprisesToShow)
    })
  }

  onPageChange($event: any) {
    this._currentSireneEntreprisesToShow =  this._sireneEntreprises.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }

  get currenSireneEntreprisesToShow(){
    return this._currentSireneEntreprisesToShow;
  }

  get sireneEntreprises(){
    return this._sireneEntreprises;
  }

  get pageSize(){
    return this._pageSize
  }



}
