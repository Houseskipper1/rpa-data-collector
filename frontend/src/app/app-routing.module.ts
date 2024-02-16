import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseSectionComponent } from './components/entreprises-section/entreprises-section.component';
import { SirenEntreprisesListComponent } from './components/siren-entreprises-list/siren-entreprises-list.component';
import { EntrepriseViewComponent } from './components/entreprise-view/entreprise-view.component';
import { ScrappingEntreprisesListComponent } from './components/scrapping-entreprises-list/scrapping-entreprises-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: EntrepriseSectionComponent },
  { path: 'sireneEntreprises', component: SirenEntreprisesListComponent },
  { path: 'scrappingEntreprises', component: ScrappingEntreprisesListComponent },
  { path: 'entreprise/:siren', component: EntrepriseViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
