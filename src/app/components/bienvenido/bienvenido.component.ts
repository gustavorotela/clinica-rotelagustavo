import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material.module';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [AngularMaterialModule,LoginComponent,RegistroComponent],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {
  showLogin: boolean = false;
  showRegister: boolean = false;

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.showRegister = false;  // Asegura que solo uno esté visible a la vez
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.showLogin = false;  // Asegura que solo uno esté visible a la vez
  }
}
