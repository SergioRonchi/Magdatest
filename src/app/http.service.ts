import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  
  getbeer() {
    return this.http.get('https://api.openbrewerydb.org/breweries')
  }


login() {
  let user={ Username:'Achin.Royale@testhow4.com', Password: 'PatPat360.Employee'};
  return this.http.post('https://patpat.avaservice.eu:9000/api/Account/GetToken', user);
}

}
