import { Component, Input } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AngularMaterialModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class LoginComponent {
  email:string = '';
  password:string = '';
  errorMessage:string = '';
  @Input() isVisible: boolean = false;

  constructor(private firestore:Firestore, public Auth:Auth) {

  }
  Login(){
    signInWithEmailAndPassword(this.Auth,String(this.email),String(this.password)).then((res) => {
      if(res.user.email != null) {
        let col = collection(this.firestore,'logins');
        addDoc(col, {fecha: new Date(), "email":this.email});
      }
    }).catch((e) => this.errorMessage = 'El usuario y/o la contraseña son incorrectas.');
  }

  LoginRapido(){
    signInWithEmailAndPassword(this.Auth,String(this.email),String(this.password)).then((res) => {
      if(res.user.email != null) {
        let col = collection(this.firestore,'logins');
        addDoc(col, {fecha: new Date(), "email":this.email});
      }
    }).catch((e) => this.errorMessage = 'El usuario y/o la contraseña son incorrectas.');
  }
}