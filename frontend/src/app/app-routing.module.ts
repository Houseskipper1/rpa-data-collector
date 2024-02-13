import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseSectionComponent } from './components/entreprises-section/entreprises-section.component';
import { SirenEntreprisesListComponent } from './components/siren-entreprises-list/siren-entreprises-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: EntrepriseSectionComponent },
  { path: 'sireneEntreprises', component: SirenEntreprisesListComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
