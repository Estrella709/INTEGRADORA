import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Administrativo } from 'src/app/models/administrativo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-administrativo',
  templateUrl: './add-update-administrativo.component.html',
  styleUrls: ['./add-update-administrativo.component.scss'],
})
export class AddUpdateAdministrativoComponent  implements OnInit {

  @Input() administrativo: Administrativo;

  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    diasTrabajo: new FormControl([], [Validators.required]), 
    diasDescanso: new FormControl([], [Validators.required]),
    horasTrabajo: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  private file: File | null = null;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.administrativo) {
      this.form.setValue({
        id: this.administrativo.id || '',
        nombre: this.administrativo.nombre,
        diasTrabajo: this.administrativo.diasTrabajo,
        diasDescanso: this.administrativo.diasDescanso,
        horasTrabajo: this.administrativo.horasTrabajo,
      });
    }
  }

  handleFileInput(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.administrativo) {
        this.updateAdministrativo();
      } else {
        this.createAdministrativo();
      }
    }
  }

  async createAdministrativo() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      let documentURL = '';
      if (this.file) {
        const path = `users/${this.user.uid}/administrativos/${Date.now()}_${this.file.name}`;
        documentURL = await this.firebaseSvc.uploadFile(this.file, path);
      }

      const formData = { ...this.form.value, documents: documentURL };
      delete formData.id;

      await this.firebaseSvc.addDocument(`users/${this.user.uid}/administrativos`, formData);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Docente creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'cloud-upload-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  async updateAdministrativo() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const path = `users/${this.user.uid}/administrativos/${this.form.value.id}`;
      await this.firebaseSvc.updateDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Docente actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

}
