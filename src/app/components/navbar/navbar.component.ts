import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: any = null

  constructor(private auth: AuthService) { 
    this.auth.getAuth().onAuthStateChanged(user => {
      this.user = user
    })
  }

  ngOnInit() {
    
  }

  logout(){
    this.auth.logout()
  }

  login(){
    this.auth.login("ariel@ariel.com","123456")
    this.ngOnInit()
  }



}
