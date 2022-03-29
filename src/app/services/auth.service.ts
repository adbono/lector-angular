import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles: string[] = []

  constructor(
    private auth: AngularFireAuth,
    private fs: AngularFirestore) { }

  async createUserWithEmailAndPass(email: string, password: string){
    return await this.auth.createUserWithEmailAndPassword(email, password)
  }

  async loginWithGoogle(){
    let user = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.getUserRoles()
    return user
  }
  
  async login(email: string, password: string){
    let user = await this.auth.signInWithEmailAndPassword(email, password)
    this.getUserRoles()
    return user
  }

  async logout(){
    return await this.auth.signOut()
  }

  getCurrentUser(){
    return this.auth.user
  }

  async getUserRoles(){
    let currentUser = await this.auth.currentUser
    this.roles = []
    await this.fs.collection('usuarios').doc(currentUser?.uid).get().forEach((e: any) => {
      if(e.data() != null) this.roles = e.data().rol
    })
    return this.roles
  }

  async addUserRol(rol: string){
    let currentUser = await this.auth.currentUser
    let currentRoles = await this.getUserRoles()
    if(!currentRoles.includes(rol)) currentRoles.push(rol)
    let rta = await this.fs.collection('usuarios').doc(currentUser?.uid).set({rol: currentRoles})
    this.getUserRoles()
    return rta
  }

  async deleteUserRol(rol: string){
    let currentUser = await this.auth.currentUser
    let currentRoles = await this.getUserRoles()
    currentRoles = currentRoles.filter(e => e != rol)
    let rta = await this.fs.collection('usuarios').doc(currentUser?.uid).set({rol: currentRoles})
    this.getUserRoles()
    return rta
  }

  async getRoles(){
    return await this.fs.collection('roles').get()
  }

  async getRolByName(rol: string){
    return await this.fs.collection('roles', ref => ref.where('nombre', '==', rol)) 
  }

  async addRol(rol: string){
    if(await this.getRolByName(rol) != null) console.log("ok!")
  }

  async deleteRol(rol: string){
    if(await this.getRolByName(rol) != null) console.log("ok!")
  }


}
