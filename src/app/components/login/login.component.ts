import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) { 
    this.form = fb.group({
      email: ['ariel@ariel.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      rememberme: false,
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.validar()){
      const {email, password} = this.form.value
      this.auth.login(email, password)
        .then((e) => {
          this.router.navigate(['home'])
        })
        .catch((e) => {
          console.log("hubo un error "+e)
        })
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
