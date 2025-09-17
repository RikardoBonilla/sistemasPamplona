import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

// Components
import {
  HeaderComponent,
  FooterComponent,
  HeroComponent,
  ServicesComponent,
  TeamComponent,
  TestimonialsComponent,
  ContactComponent
} from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    TeamComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
