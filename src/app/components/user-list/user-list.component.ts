import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  list: any[] = []

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.getList()
  }

  onChange(e: any){
    this.list.filter( data => data)
  }

  getList(){
    this.auth.getAllUsers().subscribe(data =>{
      this.list = []
      data.forEach((element: any) => {
        this.list.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      // this.loading = false
    })
  }

}
