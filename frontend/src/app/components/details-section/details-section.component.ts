import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-section',
  templateUrl: './details-section.component.html',
  styleUrls: [],
})
export class DetailsSectionComponent {
  rien(): void {
    console.log('rien');
  }

  vrai(): boolean {
    return true;
  }
}
