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
import {MatPaginatorModule} from '@angular/material/paginator';
import { EntrepriseViewComponent } from './components/entreprise-view/entreprise-view.component';

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
    EntrepriseViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
