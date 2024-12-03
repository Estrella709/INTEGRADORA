import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    image: new FormControl('')
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async Submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      const user: User = {
        uid: '', 
        email: this.form.value.email,
        password: this.form.value.password,
        name: this.form.value.name,
        image: this.form.value.image || 'default-image-url'
      };

      try {
        const signUpResponse = await this.firebaseSvc.signUp(user);
        const uid = signUpResponse.user.uid;

        await this.firebaseSvc.updateUser(user.name);

        const userInfo = { ...user, uid };
        await this.firebaseSvc.setDocument(`users/${uid}`, userInfo);

        this.utilsSvc.saveInLocalStorage('user', userInfo);
        this.utilsSvc.routerLink('/auth');
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `Usuario registrado correctamente`,
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });

      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.utilsSvc.presentToast({
          message: error.message || 'Error al registrar usuario',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      } finally {
        loading.dismiss();
      }
    }
  }
}
