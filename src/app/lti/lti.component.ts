import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import * as myFakeObjects from './myModel';
import { calculateLTIPlanParametes } from './myFunctions';


@Component({
  selector: 'app-lti',
  templateUrl: './lti.component.html',
  styleUrls: ['./lti.component.scss']
})
export class LtiComponent implements OnInit {

  exixtingPlan: object=myFakeObjects.Plan;
  goals: object=myFakeObjects.Goals;
  measures: object=myFakeObjects.Measures;
  scales: object=myFakeObjects.Scales;
  formats: object=myFakeObjects.Formats;
  
  currentPlan:any;
  currentMeasureObj:any;
  

  constructor() { }

  ngOnInit() {
    const source = interval(5000);
    source.subscribe(()=>this.updateModel());
  }
   /*************************************************************************** */
   updateModel() {
    calculateLTIPlanParametes(this.currentPlan, false);
  }
 /*************************************************************************** */
  /**
   * Creates a new Plan
   */
  newPlan() {
    this.currentPlan = {
      Name: '',
      YearStart: (new Date()).getFullYear(),
      YearEnd: (new Date()).getFullYear() + 1,
      RoundBonusFlag: undefined,
      RoundBonusValue: undefined,

      Gateways: [],
      Objectives: [],
      Correctives: [],

      CorrectiveThresholdMax: 0,
      CorrectiveThresholdMin: 0,
      CorrectiveType: 0,
      PayoutStructure: {
        PayoutType: 1,
        PayoutYearEnd: undefined,
        PayoutYearStart: undefined,
        PayoutNote: undefined,
        Rows: []
      },
      PartecipantsByYear:[
        {
          Year:  (new Date()).getFullYear(),
          Partecipants:[
            {
              "EmployeeId": "4E96A664-87F6-4348-B2C3-27B73EB6E245",
              "Name": "Marion",
              "Surname": "Acker",
              "TargetBonusPercentage": 0,
              "GrossAnnualSalary": 0,
            },
            {
              "EmployeeId": "FC3D3D67-1EBB-4E07-B457-630BB95B137E",
              "Name": "Achine",
              "Surname": "Royal",
              "TargetBonusPercentage":0,
              "GrossAnnualSalary": 0,
            },
            {
              "EmployeeId": "1EE9C0B9-8D5E-4EE4-AE92-3818725A4EB6",
              "Name": "David",
              "Surname": "Abdo",
              "TargetBonusPercentage": 0,
              "GrossAnnualSalary": 0,
            },
          ]
        }
      ],
      Note: '',
      Clauses: '',
      Document: '',
      Attachment: '',
      Date: undefined,
      ActivationDate: undefined
    };



  }
  
 /*************************************************************************** */
  addGateway(){
    let years: number[] = [];
    let yearlyValues:any[]=[];

    for (let index = this.currentPlan.YearStart; index <= this.currentPlan.YearEnd; index++) {
      years.push(index);
      yearlyValues.push({
        Year: index,
        TargetValue: 0,
        CurrentValue: 0
      });
    };
    this.currentPlan.Gateways.push({
      goals: this.goals,
      IsCorridor: false,
      Min:90,
      Max:110,
      Floor:80,
      Cap:120,
      Weight:100,
      years: years,
      YearlyValues:yearlyValues
    });
  }
  /*************************************************************************** */
  addObjective(){
    let years: number[] = [];
    let yearlyValues:any[]=[];
    for (let index = this.currentPlan.YearStart; index <= this.currentPlan.YearEnd; index++) {
      years.push(index);
      yearlyValues.push({
        Year: index,
        TargetValue: 0,
        CurrentValue: 0
      });
    };
    this.currentPlan.Objectives.push({
      goals: this.goals,
      IsCorridor: false,
      Weight:100,
      Min:90,
      Max:110,
      Floor:80,
      Cap:120,
      years: years,
      YearlyValues:yearlyValues
    });
  }
 /*************************************************************************** */
 addCorrective(){
  let years: number[] = [];
  let yearlyValues:any[]=[];
  for (let index = this.currentPlan.YearStart; index <= this.currentPlan.YearEnd; index++) {
    years.push(index);
    yearlyValues.push({
      Year: index,
      TargetValue: 0,
      CurrentValue: 0
    });
  };
  this.currentPlan.Correctives.push({
    goals: this.goals,
    IsCorridor: false,
    Weight:100,
    Min:90,
    Max:110,
    Floor:80,
    Cap:120,
    years: years,
    YearlyValues:yearlyValues
  });
}
   /*************************************************************************** */
  getGatewayTargetBonus(){
      return  this.getTotalTargetValue()
  }
   /*************************************************************************** */
  getGatewayTargetBonusMultiplierValue(){
    if(this.currentPlan && this.currentPlan.Multipliers && this.currentPlan.Multipliers.multipliers && this.currentPlan.Multipliers.multipliers.gateways){
      let g=this.currentPlan.Multipliers.multipliers.gateways;

      if (!isNaN(g.min)&&!isNaN(g.max)){
        return  {min:g.min, max:g.max};               
      }

    }

    return{min:1, max:1};            
  }
 /*************************************************************************** */
  getGatewayTargetBonusMultiplier() {
    let v=this.getGatewayTargetBonusMultiplierValue();

    if(v.min===v.max){
      return v.min.toFixed(1);
    } else {
      return v.min.toFixed(1) + "-" + v.max.toFixed(1);
    }
  
  }
 /*************************************************************************** */
  getGatewayAdmittedBonusValue() {
    let n=0.0;
    if(this.currentPlan.TotalBonus) n=this.currentPlan.TotalBonus.Target;
    let v=this.getGatewayTargetBonusMultiplierValue();
    return {min:v.min*n,max:v.max*n};
   
  }
 /*************************************************************************** */
  getGatewayAdmittedBonus() {
    let n=this.getGatewayAdmittedBonusValue();
   
    return n.min + ' - ' + n.max;
  }
  /*************************************************************************** */
  getObjectiveTargetBonusMultiplierValue(){
    if(this.currentPlan && this.currentPlan.Multipliers && this.currentPlan.Multipliers.multipliers && this.currentPlan.Multipliers.multipliers.objectives){
      let g=this.currentPlan.Multipliers.multipliers.objectives;

      if (!isNaN(g.min)&&!isNaN(g.max)){
        return  {min:g.min, max:g.max};               
      }

    }

    return{min:1, max:1};            
  }

  /*************************************************************************** */
  getObjectiveTargetBonusMultiplier() {
    let v=this.getObjectiveTargetBonusMultiplierValue();

    if(v.min===v.max){
      return v.min.toFixed(1);
    } else {
      return v.min.toFixed(1) + "-" + v.max.toFixed(1);
    }
  }
  /*************************************************************************** */
  getObjectiveAdmittedBonusValue() {
    let n=0.0;
    if(this.currentPlan.TotalBonus) n=this.currentPlan.TotalBonus.Target;
    let v=this.getObjectiveTargetBonusMultiplierValue();
    return {min:v.min*n,max:v.max*n};
   
  }
  /*************************************************************************** */
  getObjectiveAdmittedBonus() {

    let n=this.getObjectiveAdmittedBonusValue();
   
    return n.min + ' - ' + n.max;
  }
  /*************************************************************************** */
  getCorrectiveTargetBonusMultiplierValue(){
    if(this.currentPlan && this.currentPlan.Multipliers && this.currentPlan.Multipliers.multipliers && this.currentPlan.Multipliers.multipliers.correctives){
      let g=this.currentPlan.Multipliers.multipliers.correctives;

      if (!isNaN(g.min)&&!isNaN(g.max)){
        return  {min:g.min, max:g.max};               
      }

    }

    return{min:1, max:1};            
  }
  /*************************************************************************** */
  getCorrectiveObjectiveTargetBonusMultiplier() {
    let v=this.getCorrectiveTargetBonusMultiplierValue();

    if(v.min===v.max){
      return v.min.toFixed(1);
    } else {
      return v.min.toFixed(1) + "-" + v.max.toFixed(1);
    }

    return 1;
  }
  /*************************************************************************** */
  getCorrectiveAdmittedBonusValue() {
    let n=0.0;
    if(this.currentPlan.TotalBonus) n=this.currentPlan.TotalBonus.Target;
    let v=this.getCorrectiveTargetBonusMultiplierValue();
    return {min:v.min*n,max:v.max*n};
   
  }
  /*************************************************************************** */
  getCorrectiveObjectiveAdmittedBonus() {
    let n=this.getCorrectiveAdmittedBonusValue();
   
    return n.min + ' - ' + n.max;
  }
  /*************************************************************************** */
  getTotalTargetValue() {
    if (this.currentPlan && this.currentPlan.TotalBonus) {
      return this.currentPlan.TotalBonus.Target;
    }
    else {
      return "-";
    }
    
  }
  /*************************************************************************** */
  getTotalMinValue() {
    return '-';//TODO
  }
  /*************************************************************************** */
  getTotalMaxValue() {
    return '-';//TODO
  }
  /*************************************************************************** */
  getTargetValue(item,year) {
    let retValue =0;
    let previosItems:any;
    let count=0;
    switch(item.ConsultationType)
    {
      case 1: //average
        previosItems=item.YearlyValues.filter(x=>x.Year<=year.Year);
        previosItems.forEach(element => {
          retValue+=element.CurrentValue;
          count++;
        });
        retValue=retValue/count;
        break;
      case 2 : //cumulative
        previosItems=item.YearlyValues.filter(x=>x.Year<=year.Year);
        previosItems.forEach(element => {
          retValue+=element.CurrentValue;
        });

        break;
      case 4 : //punctual
        break;        
    }
   
    return retValue;
  }
  /*************************************************************************** */
  getMinValue(item,year) {
    if(item.Measure && item.Measure.MeasureType==='scale'){
      return item.Min;
    }
    else{
      let tv=this.getTargetValue(item,year);
      tv=tv*item.Min/100;
      return tv;
    }
  }
  /*************************************************************************** */
  getMaxValue(item,year) {
    if(item.Measure && item.Measure.MeasureType==='scale'){
      return item.Max;
    }
    else{
      let tv=this.getTargetValue(item,year);
      tv=tv*item.Max/100;
      return tv;
    }
  }

 /*************************************************************************** */
  onGoalChange(goalId: any, item:any) {
    console.log('onGoalChange', goalId);
    this.selectGoal(goalId,item);
  
  }
 /*************************************************************************** */
  selectGoal(goalId: string, item:any) {
    if (!goalId) return;
    item.measures=this.measures;
  }
 /*************************************************************************** */
  onMeasureChange(measureId: string, item:any) {
    if (!measureId) return;
    try {
      this.currentMeasureObj = item['measures'].filter((measure: any) => measure.Id === measureId)[0];
      console.log(this.currentMeasureObj);
      item['Measure']=this.currentMeasureObj; // =>>>> Need this to functions
      if (this.currentMeasureObj.MeasureType === 'money') {
        item['formats'] = this.formats;
      } else if (this.currentMeasureObj.MeasureType === 'scale') {
        item['scales'] = this.scales;
      }

    } catch (error) {

    }
   
  }
 /*************************************************************************** */
 checkVisible(type: number) {
  switch (type) {
    case 1: 
    return this.currentMeasureObj.ConsultationMode>=type && this.currentMeasureObj.ConsultationMode!==6;
      break;
    case 2:
    return this.currentMeasureObj.ConsultationMode===7 || this.currentMeasureObj.ConsultationMode===6 || this.currentMeasureObj.ConsultationMode===3 || this.currentMeasureObj.ConsultationMode===2;
      break;
    case 4:
    return this.currentMeasureObj.ConsultationMode>=4;
      break;
  }
}
 /*************************************************************************** */

 setChecked(value, item){
  item['ConsultationType']=value;

 }
 /*************************************************************************** */
 setValue(year: number, value: number, item) {
  if (item['YearlyValues']) {

    item['YearlyValues'].forEach((yearlyValue: any) => {
      if (yearlyValue.Year === year) {
        yearlyValue.CurrentValue = value;
      }
    });

  } else {
    item['YearlyValues'] = [];
    item['YearlyValues'].push({
      Year: year,
      TargetValue: 0,
      CurrentValue: value
    });
  }

}
 /*************************************************************************** */
checkValue(event: any, year: number, item) {
  const value=event.target.value;
 // const value = $(event.target).val();
  console.log(value, year);

  if (this.currentMeasureObj.MeasureType==='scale') {
    const currentScale = item['scales'].filter((scale: any) => scale.Id === item['ScaleId']);
    if (currentScale && currentScale[0]) {
      if (currentScale[0].Minimum <= value && currentScale[0].Maximum >= value) {
        this.setValue(year, Number(value),item);
      } else {
      }
    } else {
    }
  } else {
    this.setValue(year, Number(value),item);
  }

}

}
