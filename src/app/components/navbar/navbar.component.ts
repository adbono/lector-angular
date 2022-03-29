import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  email: string | null = ""

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(e =>
      this.email = e!.email)
  }

  logout(){
    this.auth.logout()
  }

  login(){
    this.auth.login("ariel@ariel.com","123456")
    this.ngOnInit()
  }



}
