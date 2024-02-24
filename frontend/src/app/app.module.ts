import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ScrapingSectionComponent } from './components/scraping-section/scraping-section.component';
import { EntrepriseSectionComponent } from './components/entreprises-section/entreprises-section.component';
import { EntreprisesListComponent } from './components/entreprises-list/entreprises-list.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SirenEntreprisesListComponent } from './components/siren-entreprises-list/siren-entreprises-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EntrepriseViewComponent } from './components/entreprise-view/entreprise-view.component';
import { ScrapingEntreprisesListComponent } from './components/scraping-entreprises-list/scraping-entreprises-list.component';
import { RechercheBanComponent } from './components/recherche-ban/recherche-ban.component';
import { SirenEntreprisesViewComponent } from './components/siren-entreprises-view/siren-entreprises-view.component';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { DrawerMenuComponent } from './components/drawer-menu/drawer-menu.component';
import { ParametersListComponent } from './components/parameter/parameters-list/parameters-list.component';
import { EditParameterComponent } from './components/parameter/edit-parameter/edit-parameter.component';
import { DialogComponent } from './components/parameter/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    FooterComponent,
    ScrapingSectionComponent,
    EntrepriseSectionComponent,
    EntreprisesListComponent,
    DetailsSectionComponent,
    SirenEntreprisesListComponent,
    ScrapingEntreprisesListComponent,
    EntrepriseViewComponent,
    EntreprisesListComponent,
    RechercheBanComponent,
    SirenEntreprisesListComponent,
    SirenEntreprisesViewComponent,
    RechercheBanComponent,
    DrawerMenuComponent,
    ParametersListComponent,
    EditParameterComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSliderModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
