import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseSectionComponent } from './components/entreprises-section/entreprises-section.component';
import { EntrepriseViewComponent } from './components/entreprise-view/entreprise-view.component';
import { ScrapingEntreprisesListComponent } from './components/scraping-entreprises-list/scraping-entreprises-list.component';
import { SirenEntreprisesViewComponent } from './components/siren-entreprises-view/siren-entreprises-view.component';
import { RechercheBanComponent } from './components/recherche-ban/recherche-ban.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: EntrepriseSectionComponent },
  { path: 'sireneEntreprises', component: SirenEntreprisesViewComponent },
  { path: 'sireneEntreprisesSearch', component: RechercheBanComponent },
  { path: 'scrapingEntreprises', component: ScrapingEntreprisesListComponent },
  { path: 'entreprise/:siren', component: EntrepriseViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
