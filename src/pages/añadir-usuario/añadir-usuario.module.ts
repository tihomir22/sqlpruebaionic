import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AñadirUsuarioPage } from './añadir-usuario';

@NgModule({
  declarations: [
    AñadirUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(AñadirUsuarioPage),
  ],
})
export class AñadirUsuarioPageModule {}
