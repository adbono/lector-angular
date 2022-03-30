import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private fs: AngularFirestore) { }

  async createUserWithEmailAndPass(email: string, password: string){
    await this.fs.collection('usuarios').doc()
    return await this.auth.createUserWithEmailAndPassword(email, password)
  }

  async loginWithGoogle(){
    let user = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return user
  }
  
  async login(email: string, password: string){
    let user = await this.auth.signInWithEmailAndPassword(email, password)
    return user
  }

  async logout(){
    return await this.auth.signOut()
  }

  getAuth(){
    return this.auth
  }

  getAllUsers(){
    return this.fs.collection('usuarios').snapshotChanges()
  }

  getUser(id: string){
    return this.fs.collection('usuarios').doc(id).get()
  }

  async addUserRol(user: firebase.User, roles: string[]){
    return await this.fs.collection('usuarios').doc(user.uid).set({
      email: user.email,
      rol: roles
    })
  }

  async updateUser(id: string, roles: string[]){
    await this.fs.collection('usuarios').doc(id).update({rol: roles})
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
