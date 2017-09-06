import { Validator } from 'codelyzer/walkerFactory/walkerFn';

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {State, Store} from "@ngrx/store"
import {Observable} from "rxjs/Observable";
import { UserModel } from '../../../models/user.model';
import { UsersEffects } from '../../../effects/users.effects';
//import {ApplicationStore} from "../../../app.store"
import * as UserActions from '../../../actions/users.actions';
import * as fromRoot from '../../../reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class UsersComponent implements OnInit {
    userCreate: boolean;
    userModuleCount$: Observable<number>;
    currentUserPage$: Observable<number>;
    currentPage: number //this is the current page number that we will get from the ngxpagination

    userEdit: boolean;
    user: UserModel ;
    actionUser: UserModel;
    users$: Observable<any>;
    complexForm : FormGroup;
    user_types= ["r1", "r2", "admin", "superadmin", "general", "r3"];
    create_domains = [true, false]
    constructor(private store: Store<fromRoot.AppState>, fb: FormBuilder ) {
       this.store.select(fromRoot.getAuthenticatedUser)
            .subscribe(value => {
            console.log("Authenticated user" + value.user_id)
            this.actionUser = value
        });



    this.complexForm = fb.group({
      first_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      last_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
     create_domain : [''],
      username: [''],
      user_secret: [''],
      
      

    }, {validator: this.checkIfMatchingPasswords('password', 'confirm_password')});

    this.complexForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now

    // Here we are using the FormBuilder to build out our form.
  
            //this.users$.subscribe((user) => console.log(user))
            this.users$ = this.store.select(fromRoot.getUsers);
            this.currentUserPage$ = this.store.select(fromRoot.getUserPages);
            this.userModuleCount$ = this.store.select(fromRoot.getUserCount);
    //this.store.dispatch(new UserActions.Loadusers())

}

  
checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
          return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
              console.log("password doeasnt match")
              return passwordConfirmationInput.setErrors(this.formErrors["confirm_password"]["MatchPassword"])
            }
            else {
              console.log("password matched")
                return passwordConfirmationInput.setErrors(null);
            }
          }
        }

  onValueChanged(data?: any) {
    if (!this.complexForm) { return; }
    const form = this.complexForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors = {
    'first_name': '',
    'last_name': '',
    'username': '',
    'email': '',
    'phone_number': '',
    'password': '',
    'confirm_password': '',
   'user_type': '',
   'create_domain': '',
   'user_secret': ''
  
  };

  validationMessages = {
    'first_name': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 4 characters long.',
      'maxlength':     'First Name cannot be more than 24 characters long.',
    },
    
    'last_name': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 4 characters long.',
      'maxlength':     'Last cannot be more than 24 characters long.',
    },

      'username': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 4 characters long.',
      'maxlength':     'Last cannot be more than 24 characters long.',
    },
    'email': {
      'required': 'Email is required.',
      'email': "Pleae enter a valid meail id"
    },


    'phone_number': {
      'required': 'Phone number is required.'
    },
    
    'password': {
      'required': 'Password is required.'
    },

    'confirm_password': {
      'required': 'Confirm is required.',
      "MatchPassword": "Password Do not match"
    },

     'superadmin': {
      'required': 'user_type is required.'
       
     },


     'user_secret': {
      'required': 'user_secret is required.'
       
     },
  }


                                                                                                           
  ngOnInit() {
    this.userCreate = false;
    this.store.dispatch(new UserActions.Loadusers({"skip": 0, "limit": 15, "search_text": null}))
    
  }


  addUser(){
    console.log("Add user form has been created");
    this.userCreate = true;
    this.userEdit= false;    

  }
  
  addUserSubmit(user: UserModel){
        console.log(user)
        this.store.dispatch(new UserActions.Adduser(user))
  	    console.log("request Completed for adding user");
      }

  editUserSubmit(user: UserModel){
        this.store.dispatch(new UserActions.Edituser(user))
        this.userEdit= false;    
        
  }
  
  deleteUser(user: UserModel){
        console.log(user)
        console.log(this.actionUser)
        this.store.dispatch(new UserActions.Deleteuser({"user_id": user.user_id, "action_user_id": this.actionUser.user_id }))
    
  }

  editUser(user: UserModel){
      this.userCreate = true;
      this.user = user

      this.complexForm.setValue({
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email:  this.user.email,
          phone_number: this.user.phone_number,
          password: this.user.password,
          confirm_password: this.user.password,
          user_type: this.user.user_type,
          user_secret: null,
          create_domain : this.user.create_domain,
          username: this.user.username,
      })
  }



      pageNanoskillChanged(input){
        console.log("changed nanoskill clicked")
        this.currentPage = input
        this.store.dispatch(new UserActions.Loadusers({"skip": 15*(input-1), "limit": 15, "search_text": null}))
    
    }
    

    search_text_changed(search_text){
        this.store.dispatch(new UserActions.Loadusers({ "skip": 0, "limit": 15, "search_text": search_text}))
        this.userCreate = false
      }
}
