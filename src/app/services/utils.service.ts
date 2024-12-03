import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
 
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  router = inject(Router);


  async takePicture(promptLabelHeader: string, source: CameraSource = CameraSource.Prompt) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source
    });
  }

  // ===== ALERT =====
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  // ===== LOADING =====
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  // ===== TOAST =====
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // ===== ENRUTA A CUALQUIER PAGINA DISPONIBLE =====
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // ===== GUARDA UN ELEMENTO EN EL LOCALSTORAGE =====
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // ===== OBTIENE UN ELEMENTO EN EL LOCALSTORAGE =====
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  // ===== MODAL =====
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
    
  }
}
