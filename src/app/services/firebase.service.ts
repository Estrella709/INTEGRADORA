import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilsService } from './utils.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private utilSvc: UtilsService
  ) {}

  // ============== AUTENTICACION ==============

  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }

  // ============== BASE DE DATOS ==============

  getCollectionData(path: string) {
    const ref = this.firestore.collection(path);
    console.log('Fetching data from:', path);
    return ref.valueChanges({ idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  updateDocument(path: string, data: any) {
    return this.firestore.doc(path).update(data);
  }

  deleteDocument(path: string) {
    return this.firestore.doc(path).delete();
  }

  setDocument(path: string, data: any) {
    return this.firestore.doc(path).set(data);
  }

  async getDocument<T>(path: string): Promise<T | undefined> {
    const docRef = this.firestore.doc<T>(path);
    const docSnap = await docRef.get().toPromise();
    return docSnap.exists ? docSnap.data() : undefined;
  }

  addDocument(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }

  // ============== ALMACENAMIENTO ==============

  async uploadImage(path: string, data_url: string) {
    const storageRef = ref(getStorage(), path);
    const response = await fetch(data_url);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(getStorage(), path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async getFilePath(url: string) {
    const storage = getStorage();
    const storageRef = ref(storage, url);
    return storageRef.fullPath;
  }

  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }


  

}
