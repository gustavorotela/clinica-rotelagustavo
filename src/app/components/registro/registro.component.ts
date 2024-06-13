import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Storage, getDownloadURL,ref, getStorage, uploadBytes } from '@angular/fire/storage';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [AngularMaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  animations: [
    trigger('fade', [
      state('out', style({ opacity: 0 })),
      state('in', style({ opacity: 1 })),
      transition('out <=> in', animate('300ms ease-in-out'))
    ])
  ]
})
export class RegistroComponent {
  @Input() isVisible: boolean = false;
  patientForm: FormGroup;
  specialistForm: FormGroup;
  specialties: string[] = ['Cardiología', 'Dermatología', 'Neurología'];

  constructor(private fb: FormBuilder, private auth:Auth, private firestore:Firestore, private storage: Storage) {
    this.patientForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      dni: ['', Validators.required, Validators.minLength(6)],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: [null],
      imagen2: [null]
    });

    this.specialistForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      dni: ['', Validators.required, Validators.minLength(6)],
      especialidad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: [null]
    });
  }

  onFileChange(event: any, imageControl: string) {
    const file = event.target.files[0];
    if (file) {
      if (imageControl === 'image1' || imageControl === 'image2') {
        this.patientForm.patchValue({ [imageControl]: file });
      } else {
        this.specialistForm.patchValue({ [imageControl]: file });
      }
    }
  }

  addSpecialty() {
    const newSpecialty = prompt('Ingrese la nueva especialidad:');
    if (newSpecialty) {
      this.specialties.push(newSpecialty);
    }
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async onSubmitPatient() {
    if (this.patientForm.valid) {
      try {
        const { nombre, apellido, edad, obraSocial, dni, email, password, imagen1, imagen2 } = this.patientForm.value;
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        const image1Url = imagen1 ? await this.uploadImage(imagen1, `patients/${user.uid}/image1.jpg`) : null;
        const image2Url = imagen2 ? await this.uploadImage(imagen2, `patients/${user.uid}/image2.jpg`) : null;

        await sendEmailVerification(user);
        let col = collection(this.firestore,'usuarios');
        addDoc(col, {nombre: nombre, apellido: apellido, edad: edad, obraSocial: obraSocial, dni: dni, email: email});
      } catch (error) {
        console.error('Error en el registro del paciente:', error);
      }
    }
  }

  async onSubmitSpecialist() {
    if (this.specialistForm.valid) {
      try {
        const { nombre, apellido, edad, dni, especialidad, email, password, imagen1 } = this.specialistForm.value;
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        const profileImageUrl = imagen1 ? await this.uploadImage(imagen1, `specialists/${user.uid}/profile.jpg`) : null;

        await sendEmailVerification(user);
        let col = collection(this.firestore,'usuarios');
        addDoc(col, {nombre: nombre, apellido: apellido, edad: edad, especialidad: especialidad, dni: dni, email: email});
      } catch (error) {
        console.error('Error en el registro del especialista:', error);
      }
    }
  }
}
