//import { RouterState } from '@angular/router';
import { Selecteddomain } from '../actions/ontology.actions';
import { combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import {Observable} from "rxjs/Observable";
import {State, Store, } from "@ngrx/store"
import { compose } from '@ngrx/core/compose';
import 'rxjs/add/operator/let'; 
import { ActionReducer } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as fromDomain from './domain.reducer';
import * as fromConcept from './concept.reducer';
import * as fromUser from './users.reducer';
import * as fromAuthentication from "./authentication.reducer"
import * as fromRouter from '@ngrx/router-store';

export interface AppState {
  domains: fromDomain.DomainState;
  concepts: fromConcept.ConceptState;
  users: fromUser.UserState;
  router: fromRouter.RouterState,
  authentication: fromAuthentication.AuthenticateState
}




export const reducers  = {
  domains: fromDomain.DomainReducer,
  concepts: fromConcept.ConceptReducer,
  users: fromUser.UsersReducer,
  router: fromRouter.routerReducer,
  authentication: fromAuthentication.AuthenticationReducer

};


export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}




export const reducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);

export const getUserAppState =   (state: AppState) => state.users;
export const getDomainAppState =  (state: AppState) => state.domains;
export const getConceptAppState =  (state: AppState) => state.concepts;
export const getAuthAppState =  (state: AppState) => state.authentication;


/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
export const getUserState = createSelector(
  getUserAppState,
  (state: AppState) => state.users
);

export const getDomainState = createSelector(
  getDomainAppState,
  (state: AppState) => state.domains
);

export const getConceptState = createSelector(
  getConceptAppState,
  (state: AppState) => state.concepts
);
 */


export const getAuthenticatedUser = createSelector(getAuthAppState, fromAuthentication.getAuthenticatedUser);
export const getAuthenticationError = createSelector(getAuthAppState, fromAuthentication.getAuthenticationError);
export const isAuthenticated = createSelector(getAuthAppState, fromAuthentication.isAuthenticated);
export const isAuthenticatedLoaded = createSelector(getAuthAppState, fromAuthentication.isAuthenticatedLoaded);
export const isAuthenticationLoading = createSelector(getAuthAppState, fromAuthentication.isLoading);



export const getUsers = createSelector(getUserAppState, fromUser.getUsers)
export const getUserIds = createSelector(getUserAppState, fromUser.getUsersId)
export const getSelectdUserId = createSelector(getUserAppState, fromUser.selectedUserId)
export const getSelectedUser = createSelector(getUserAppState, fromUser.getSelectedUser)


export const getDomains = createSelector(getDomainAppState, fromDomain.getDomains)
export const getDomainIds = createSelector(getDomainAppState, fromDomain.getDomainIds)
export const getSelectdDomainId = createSelector(getDomainAppState, fromDomain.selectedDomainId)
export const getSelectedDomain = createSelector(getDomainAppState, fromDomain.getSelectedDomain)


export const getConcepts = createSelector(getConceptAppState, fromConcept.getAllConcepts)
export const getConceptIds = createSelector(getConceptAppState, fromConcept.getConceptIds)
export const getSelectdConceptId = createSelector(getConceptAppState, fromConcept.selectedConceptId)
export const getSelectedConcept = createSelector(getConceptAppState, fromConcept.getSelectedConcept )



//export const reducer: ActionReducer<AppState> = combineReducers(reducers);
