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

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    FooterComponent,
    ScrapingSectionComponent,
    EntrepriseSectionComponent,
    EntreprisesListComponent,
    SirenEntreprisesListComponent,
    ScrapingEntreprisesListComponent,
    EntrepriseViewComponent,
    EntreprisesListComponent,
    RechercheBanComponent,
    SirenEntreprisesListComponent,
    SirenEntreprisesViewComponent,
    RechercheBanComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
