import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { Entreprise } from 'src/app/shared/types/entreprise.type';
import * as L from 'leaflet';
@Component({
  selector: 'app-entreprise-view',
  templateUrl: './entreprise-view.component.html',
  styleUrls: ['./entreprise-view.component.css'],
})
export class EntrepriseViewComponent implements OnInit, AfterViewInit {
  private _entreprise: Entreprise;
  private map!: L.Map;
  markers: L.Marker[] = [
    //L.marker([31.9539, 35.9106]), // Amman
  ];
  constructor(
    private _route: ActivatedRoute,
    private _entrepriseService: EntrepriseService,
    private _router: Router
  ) {
    this._entreprise = {} as Entreprise;
  }

  ngOnInit() {
    // Get the 'siren' parameter from the route
    const siren = this._route.snapshot.paramMap.get('siren');
    if (siren) {
      this._entrepriseService.getEntreprisesBySiren(siren).subscribe((data) => {
        this._entreprise = data;
      });
    } else {
      this._router.navigate(['/home']);
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
    L.marker([
      this.entreprise.location[0].latitude,
      this.entreprise.location[0].longitude,
    ]).addTo(this.map);
  }
  get entreprise(): Entreprise {
    return this._entreprise;
  }

  set entreprise(value: Entreprise) {
    this._entreprise = value;
  }

  private initializeMap() {
    this.map = L.map('map', {
      center: [      this.entreprise.location[0].latitude,
      this.entreprise.location[0].longitude], // Paris coordinates
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }),
      ],
    });
  }

  private addMarkers() {
    // Add your markers to the map
    //this.markers.forEach((marker) => marker.addTo(this.map));
  }
}
