import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUpdateAsistentComponent } from 'src/app/shared/components/add-update-asistent/add-update-asistent.component';
import { ViewGroupAsistentComponent } from 'src/app/shared/components/view-group-asistent/view-group-asistent.component';
import { groups } from 'src/app/data/groups-data';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  asistencias: any[] = [];
  user: any;
  groups = groups;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getAsistencias();
  }

  async getAsistencias() {
    const path = `users/${this.user.uid}/asistencias`;
    this.firebaseSvc.getCollectionData(path).subscribe((data) => {
      this.asistencias = data;
    });
  }

  async addUpdateProyect() {
    const modal = await this.modalCtrl.create({
      component: AddUpdateAsistentComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.success) {
      this.getAsistencias();  // Refresh the list after adding a new asistencia
    }
  }

  async viewGroupAsistencias(level: string, group: string) {
    const modal = await this.modalCtrl.create({
      component: ViewGroupAsistentComponent,
      componentProps: {
        level,
        group,
        userId: this.user.uid
      }
    });
    await modal.present();
  }


}
