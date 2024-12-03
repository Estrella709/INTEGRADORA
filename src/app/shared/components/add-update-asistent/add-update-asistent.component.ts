import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { groups } from 'src/app/data/groups-data';
import { CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-update-asistent',
  templateUrl: './add-update-asistent.component.html',
  styleUrls: ['./add-update-asistent.component.scss'],
})
export class AddUpdateAsistentComponent implements OnInit {
  form = new FormGroup({
    image: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    teacher: new FormControl('', [Validators.required]),
  });

  groups = groups;
  teachers = ['Lothar Yamir Hernandez Gaona', 'Alberto Avendaño Muñoz', 'Felix Bautista Meza', 'Isrrael Palafox Morales','Guillermo Martinez Maza','Milagros Muñoz Bauza','Rufino Hernandez Hernandez'];
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user: User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    console.log('Usuario cargado:', this.user);
  }

  async takeImage() {
    try {
      const result = await this.utilsSvc.takePicture('Tomar una foto');
      console.log('Imagen capturada:', result.dataUrl);
      this.form.controls.image.setValue(result.dataUrl);
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
      this.utilsSvc.presentToast({
        message: 'Error al capturar la imagen. Verifica los permisos.',
        duration: 2000,
        color: 'danger',
      });
    }
  }

  async submit() {
    if (this.form.valid) {
      console.log('Formulario válido, enviando datos:', this.form.value);
      await this.createAsistencia();
    } else {
      console.error('Formulario inválido:', this.form.value);
      this.utilsSvc.presentToast({
        message: 'Por favor, completa todos los campos antes de enviar.',
        duration: 2000,
        color: 'danger',
      });
    }
  }

  async createAsistencia() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const dataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      const formData = {
        image: imageUrl,
        level: this.form.value.level,
        group: this.form.value.group,
        teacher: this.form.value.teacher,
        date: new Date().toISOString(),
      };

      await this.firebaseSvc.addDocument(`users/${this.user.uid}/asistencias`, formData);

      console.log('Asistencia guardada con éxito:', formData);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Asistencia subida exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'cloud-upload-outline',
      });
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      this.utilsSvc.presentToast({
        message: 'Error al guardar la asistencia.',
        duration: 2500,
        color: 'danger',
      });
    } finally {
      loading.dismiss();
    }
  }
}
