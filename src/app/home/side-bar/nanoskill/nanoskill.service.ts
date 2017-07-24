import { NanoskillRoutes } from './nanoskill.route';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, Response } from '@angular/http';
import {NanoskillModel} from "./nanoskill.model"
import {Observable} from "rxjs/Observable";
import {NanoskillStore} from "./nanoskill.store"
import {NANOSKILLS_ACTIONS} from "./nanoskill.actions";
import 'rxjs/Rx';

@Injectable()
export class NanoskillService {
  
  private USER_API_URL = 'http://localhost:8000/nanoskills/39816f6a9ebaf24c8cdd3c9df8fd09072b8b27db'
  public nanoskills: Observable<Array<NanoskillModel>>;

  constructor(private store: Store<NanoskillStore>, private http: Http) {
      this.nanoskills = store.select("nanoskills")
      console.log(this.http.head)

   }


  public loaditems() {
    this.http.get(this.USER_API_URL).map(res => res.json())
    .map(payload => ({ type: NANOSKILLS_ACTIONS.LOAD_NANOSKILL, payload}))
    .subscribe(action => this.store.dispatch(action));}

  /*
  createItem(item: Item) {
    this.http.post(this.USER_API_URL, JSON.stringify(item), HEADER)
    .map(res => res.json())
    .map(payload => ({ type: 'CREATE_ITEM', payload }))
    .subscribe(action => this.store.dispatch(action));
}
  updateItem(item: Item) {
  this.http.put(`${BASE_URL}${item.id}`, JSON.stringify(item), HEADER)
    .subscribe(action => this.store.dispatch({ type: 'UPDATE_ITEM', payload: item }));
}

  deleteItem(item: Item) {
    this.http.delete(`${BASE_URL}${item.id}`)
    .subscribe(action => this.store.dispatch({ type: 'DELETE_ITEM', payload: item }));
  }
  */

  }