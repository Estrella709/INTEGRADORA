import { Component, OnInit } from '@angular/core';
import { Administrativo } from 'src/app/models/administrativo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateAdministrativoComponent } from 'src/app/shared/components/add-update-administrativo/add-update-administrativo.component';

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.page.html',
  styleUrls: ['./administrativos.page.scss'],
})
export class AdministrativosPage implements OnInit {

  administrativos: Administrativo[] = [];
  loading: boolean = true; // Establecer la carga inicial en true

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.getAdministrativos();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getAdministrativos();
  }

  getAdministrativos() {
    const path = `users/${this.user().uid}/administrativos`;
    this.loading = true;
  
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.administrativos = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener administrativos:', err);
        this.loading = false;
      }
    });
  }
  

  async addUpdateAdministrativo(administrativo?: Administrativo) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateAdministrativoComponent,
      cssClass: 'add-update-modal',
      componentProps: { administrativo },
    });
    if (success) this.getAdministrativos(); // Refrescar la lista después de agregar o actualizar
  }

  async confirmDeleteAdministrativo(administrativo: Administrativo) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar',
      message: '¿Estás seguro de que quieres eliminar este docente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteAdministrativo(administrativo);
          },
        },
      ],
    });
  }


  async deleteAdministrativo(administrativo: Administrativo) {
    const path = `users/${this.user().uid}/administrativos/${administrativo.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async () => {
      this.administrativos = this.administrativos.filter((p) => p.id !== administrativo.id);
      this.utilsSvc.presentToast({
        message: 'Docente eliminado exitosamente',
        duration: 1500,
        color: 'danger',
        position: 'middle',
        icon: 'trash-bin-outline',
      });
    }).catch((error) => {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}
