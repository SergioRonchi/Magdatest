import { Component, OnInit } from '@angular/core';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { HttpService } from '../http.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { forEach } from '@angular/router/src/utils/collection';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  clickCounter: number=0;
  name: string='';
  celsius:number=null;
  farenheit: number=null;
  accesstoken: any;
  

  constructor(private _http: HttpService) { }

  /**
   * Initialization
   */
  ngOnInit() { 
    
  }
  /**
   * Click event handler
   */
  countClick() {
    this.clickCounter += 1;
  
  }

 

  /**
   * Changes style according to counter value
   */
  setClasses() {
    let myClasses = {
      active: this.clickCounter > 4,
      nonactive: this.clickCounter <= 4,
    };
    return myClasses;
  }
  /**
   * Converst celsius to farenheit
   */
  convert() {
    this.farenheit = this.celsius * 1.8 + 32;
    return this.farenheit;
  }
  /**
   * Simulate a login to PatPat to get access token
   */
  onclick() {
  this._http.login().subscribe(result => {
    this.accesstoken = result["access_token"];
  })
  }

}

