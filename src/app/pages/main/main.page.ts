import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    { title: 'Asistencia', url: '/main/home', icon: 'person-outline' },
    { title: 'Docentes', url: '/main/docentes', icon: 'person-outline' },
    { title: 'Administrativos', url: '/main/administrativos', icon: 'person-outline' }
  ];
  router = inject(Router);
  currentPath: string = '';
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // ==== Cerrar sesion ====
  signOut() {
    this.firebaseSvc.signOut();
  }


}
