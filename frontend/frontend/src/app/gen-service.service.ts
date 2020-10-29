import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class GenServiceService {

baseUrl: string = "http://poochfriendly.herokuapp.com/api/";

  constructor(private _http: HttpClient) { }

  sendLoginRequest(username: string, password: string) {

  let url = this.baseUrl + "auth/login";
  let data = {
    "username": username,
    "password": password
    }
  
  this._http.post(url, null, { params: data, withCredentials: true});

  }

  sendAdminLoginRequest(username: string, password: string) {

    let url = this.baseUrl + "auth/login-admin";
    let data = {
      "username": username,
      "password": password
      }
    
    this._http.post(url, null, {params: data, withCredentials: true});

  }

  sendLogoutRequest() {

    let url = this.baseUrl + "auth/logout";

    this._http.post(url, null, {withCredentials: true});
  }

  getAvailabilityForCaretaker(startPeriod: string, endPeriod: string) {

    let url = this.baseUrl + "availability";

    let data = {
      "startPeriod": startPeriod,
      "endPeriod": endPeriod
    }

    this._http.get(url, {params: data, withCredentials: true});
  } 

  addCaretakerAvailability(startDates: string, endDate: string, category: string, dailyPrice: string) {

    let url = this.baseUrl + "availability/";

    let data = { 
      "availabilityStartDate": startDates,
      "availabilityEndDate": endDate,
      "petCategory": category,
      "dailyPrice": dailyPrice
    };

    this._http.post(url, null, {params: data, withCredentials: true});

  }

  getAllBids() {
    let url = this.baseUrl + "bid";
    this._http.get(url, { withCredentials: true});
  }

  selectBidByOwner(petName: string, start: string, end: string, caretaker: string, availabilityStart: string,
    availablityEnd: string, price: string) {

    let url = this.baseUrl + "bid";

    let data = {
    "poPetName": petName,
    "bidStartPeriod": start,
    "bidEndPeriod": end,
    "ctUsername": caretaker,
    "availabilityStartDate": availabilityStart,
    "availabilityEndDate": availablityEnd,
    "bidPrice": price
      }

    this._http.post(url, null, {params: data, withCredentials: true});
  }

  caretakerAcceptBid(owner: string, pet: string, bidStart: string, bidEnd: string, availStart: string,
    availEnd: string, paymentMode: string, petPickUp: string) {
    let url = this.baseUrl + "bid/choose-bid";

    let data = {
      "poUsername": owner,
    "poPetName": pet,
    "bidStartPeriod": bidStart,
    "bidEndPeriod": bidEnd,
    "availabilityStartDate": availStart,
    "availabilityEndDate": availEnd,
    "paymentMtd": paymentMode,
    "petTransferMtd": petPickUp
    }

    this._http.post(url, null, { params: data, withCredentials: true});
  }

  submitReview(pet: string, bidStart: string, bidEnd: string, caretaker: string, availStart: string,
    availEnd: string, rating: string, review: string) {

    let url = this.baseUrl + "bid/submit-rating-review";

    let data = {
      "poPetName": pet,
      "bidStartPeriod": bidStart,
      "bidEndPeriod": bidEnd,
      "ctUsername": caretaker,
      "availabilityStartDate": availStart,
      "availabilityEndDate": availEnd,
      "rating": rating,
      "review": review
    }

    this._http.post(url, null, { params: data, withCredentials: true});
  }

  petOwnerDeleteBid(pet: string, bidStart: string, bidEnd: string, caretaker: string, availStart: string,
    availEnd: string) {

    let url = this.baseUrl + "bid";

  let data = {
    "poPetName": pet,
      "bidStartPeriod": bidStart,
      "bidEndPeriod": bidEnd,
      "ctUsername": caretaker,
      "availabilityStartDate": availStart,
      "availabilityEndDate": availEnd
    }

    this._http.delete(url, {params: data, withCredentials: true});
  }

  adminAddPetCategory(category: string, basePrice: string) {

    let url = this.baseUrl + "pet-category";

    let data = {
      "pet_category_name": category,
      "base_price": basePrice
    }

    this._http.post(url, null, { params: data, withCredentials: true});
  }

  getAllPetCategories() {

    let url = this.baseUrl + "pet-category";
    this._http.get(url, {withCredentials: true});
  }

  adminDeletePetCategory(petCategory: string) {

    let url = this.baseUrl + "pet-category";
    
    let data = {
      "pet_category_name": petCategory
    }

    this._http.delete(url, {params: data, withCredentials: true});
  }

  petOwnerAddsPet(petName: string, specialReq: string, category: string) {


    let url = this.baseUrl + "pet";

    let data = {
      "pet_name": petName,
      "special_requirements": specialReq,
      "pet_category_name": category
    }

    this._http.post(url, null, { params: data, withCredentials: true});
  }

  getUserPets() {

    let url = this.baseUrl + "pet";

    this._http.get(url, {withCredentials: true});
  }

  //changes
  userDeletesPetOwned(pet: string) {

    let url = this.baseUrl + "pet";

    let data = {
      "pet_name": pet
    }

    this._http.delete(url, { params: data, withCredentials: true});
  }

  createAccount(username: string, email: string,name: string,  password: string, userType: string, pet: string,
    category: string, specialReq: string) {

    let url = this.baseUrl + "user/create-account";

    let data = {
      "username": username,
      "email": email,
      "name": name,
      "password": password,
      "userType": userType,
      "petName": pet,
      "petSpecialReqs": specialReq,
      "petCategory": category
    }

    this._http.post(url, null, {params: data, withCredentials: true});
  }

  adminGetUsersDetails() {

    let url = this.baseUrl + "user/user-details";

    this._http.get(url, {withCredentials: true});
  }

  adminDeleteUser(username: string) {

    let url = this.baseUrl + "user";

    let data = {
      "username": username
    }

    this._http.delete(url, { params: data, withCredentials: true});
  }

  adminVerifiesPartTimeCaretaker(caretaker: string) {

    let url = this.baseUrl + "user/verify-pt-caretaker";

    let data = {
      "ct_username": caretaker
    }

    this._http.post(url, null, {params: data, withCredentials: true});
  }
}
