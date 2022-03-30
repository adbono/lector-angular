import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  form: FormGroup
  roles: string[] = ['usuario']
  id: string | null

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private aRoute: ActivatedRoute) { 
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.cargar()
  }

  cargar(){
    if(this.id != null){
      this.auth.getUser(this.id).subscribe((data: any) => {
        const {email, rol} = data.data()
        this.form.patchValue({email: email, password: '12345678910'})
        this.form.controls['password'].disable()
        
        this.roles = rol
        this.roles.forEach(e => document.getElementById(e)?.setAttribute('checked','true'))

      })
    }
  }

  addRol(rol: string, event: any){
    if(event.target.checked) this.roles.push(rol);
    else this.roles = this.roles.filter(e => e != rol)
  }

  async onSubmit(){
    
    if(this.validar()){
      if(this.id == null){
        const {email, password} = this.form.value
        await this.auth.createUserWithEmailAndPass(email, password)
        .then(async e => {
          if(e.user != null) await this.auth.addUserRol(e.user, this.roles)
          this.router.navigate(['userList'])
        })
        .catch(e => console.log("error: "+e))
      }else{
        await this.auth.updateUser(this.id, this.roles)
        .then(e => this.router.navigate(['userList']))
      }
    }
  }

  validar() {
    let error = true
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = this.form.get(key)!.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          var element = document.querySelector(`input[formControlName='${key}']`);
          element?.classList.add('is-invalid')
        //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          var msg = document.getElementById(`msg${key}`);
          if(keyError == 'email') msg!.innerHTML = "Debe ser un email valido";
          if(keyError == 'required') msg!.innerHTML = "Este campo es requerido";
          if(keyError == 'minlength') msg!.innerHTML = "Debe tener al menos 6 caracteres";
          error = false
        });
      }
    });
    return error
  }

}
