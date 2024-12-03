import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateDocentesComponent } from 'src/app/shared/components/add-update-docentes/add-update-docentes.component';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.page.html',
  styleUrls: ['./docentes.page.scss'],
})
export class DocentesPage implements OnInit {
  docentes: Docente[] = [];
  loading: boolean = true; // Establecer la carga inicial en true

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.getDocentes();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getDocentes();
  }

  getDocentes() {
    const path = `users/${this.user().uid}/docentes`;
    this.loading = true;
  
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.docentes = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener docentes:', err);
        this.loading = false;
      }
    });
  }
  

  async addUpdateDocente(docente?: Docente) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateDocentesComponent,
      cssClass: 'add-update-modal',
      componentProps: { docente },
    });
    if (success) this.getDocentes(); // Refrescar la lista después de agregar o actualizar
  }

  async confirmDeleteDocente(docente: Docente) {
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
            this.deleteDocente(docente);
          },
        },
      ],
    });
  }


  async deleteDocente(docente: Docente) {
    const path = `users/${this.user().uid}/docentes/${docente.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async () => {
      this.docentes = this.docentes.filter((p) => p.id !== docente.id);
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
