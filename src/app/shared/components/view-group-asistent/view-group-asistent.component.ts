import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-view-group-asistent',
  templateUrl: './view-group-asistent.component.html',
  styleUrls: ['./view-group-asistent.component.scss'],
})
export class ViewGroupAsistentComponent implements OnInit {
  @Input() level: string;
  @Input() group: string;
  @Input() userId: string;
  
  asistencias: any[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getAsistencias();
  }

  async getAsistencias() {
    const path = `users/${this.userId}/asistencias`;
    this.firebaseSvc.getCollectionData(path).subscribe((data) => {
      this.asistencias = data.filter(asistencia => asistencia.level === this.level && asistencia.group === this.group);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
