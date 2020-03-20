import { Component, OnInit } from '@angular/core';
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

    calculateLTIPlanParametes(this.currentPlan);

  }
  
 /*************************************************************************** */
  addGateway(){
    let years: number[] = [];
    for (let index = this.currentPlan.YearStart; index <= this.currentPlan.YearEnd; index++) {
      years.push(index)
    }
    this.currentPlan.Gateways.push({
      goals: this.goals,
      IsCorridor: false,
      years: years
    });
  }
   /*************************************************************************** */
  getGatewayTargetBonus(){
      return 0; //TODO
  }
   /*************************************************************************** */
  getGatewayTargetBonusMultiplier(){
    return 0; //TODO
  }
   /*************************************************************************** */
  getGatewayAdmittedBonus(){
    return 0; //TODO
  }
  /*************************************************************************** */
  getTotalTargetValue() {
    return '-';//TODO
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
  getTargetValue(year: number) {
    return '-';//TODO
  }
  /*************************************************************************** */
  getMinValue(year: number) {
    return '-';//TODO
  }
  /*************************************************************************** */
  getMaxValue(year: number) {
    return '-';//TODO
  }
 /*************************************************************************** */
  updateModel() {
    calculateLTIPlanParametes(this.currentPlan);
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

}
