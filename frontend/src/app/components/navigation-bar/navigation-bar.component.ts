import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: [],
})
export class NavigationBarComponent {
  constructor(private _router: Router) {}

  goToHome() {
    this._router.navigate(['/']);
  }
}
