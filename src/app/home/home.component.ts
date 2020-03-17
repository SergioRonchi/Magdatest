import { Component, OnInit } from '@angular/core';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { HttpService } from '../http.service';

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
    this.Plan["Multipliers"] = this.calculateAllMultipliers(this.Plan);

  }
  /**
   * Click event handler
   */
  countClick() {
    this.clickCounter +=1;
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
    this.farenheit=this.celsius*1.8 +32;
    return this.farenheit;
  }
  /**
   * Simulate a login to PatPat to get access token
   */
  onclick() {
  this._http.login().subscribe(result => {
    this.accesstoken=result["access_token"];
  })
  }
  /**
   * 
   * @param p 
   * @param r 
   */
 getCalculatedValue(p,r){
 let x=r.TargetValue*r.CurrentValue;
 let y=p.YearStart*2;
 return {x,y};
 }
 /**
  * Calculates Plan Target Bonus
  * @param p The LTI Plan
  */
 getTargetBonus(p){
   let yd=p.YearEnd-p.YearStart+1-p.PartecipantsByYear.length;
   let lastavbonus=0;
   let sum=0;
   p.PartecipantsByYear.forEach(pbyyear => {
    lastavbonus=this.getYearlyTargetBonus(pbyyear);
    sum += lastavbonus;
   });
   sum += yd*lastavbonus;
   return sum;
 }

 /**
  * Calculates the Target Bonus of single year
  * @param p by year parteciopants
  */
 getYearlyTargetBonus(p){
  let sum=0;
  p.Partecipants.forEach(part => {
    sum += part.TargetBonusPercentage*part.GrossAnnualSalary;
  }); 
  return sum;
}


/**
 * Calculates a multiplier 
 * @param o 
 * @param year 
 */
 getMultiplier(o,year){
  let multiplier = 
     ((o.Cap-o.Floor)/(o.Max-o.Min))*
     (year.calcCurrentValue/year.calcTargetValue-o.Max)
     +o.Cap;

  if (isNaN(multiplier)) {
    return 1;
  }
  else {
    return multiplier;
  };
}

getWeightedMultiplier(gat,year){
  let weightedmultiplier = 
     gat.Weight *  (((gat.Cap-gat.Floor)/(gat.Max-gat.Min))*
     (year.calcCurrentValue/year.calcTargetValue-gat.Max)
     +gat.Cap)
     ;
  if (isNaN(weightedmultiplier)) {
    return gat.Weight;
  }
  else {
    return weightedmultiplier;
  };
}

/**
 * Adds a multiplier to GrandMultipliers object
 * @param list list of object to scan
 * @param m  GrandMultipliers object
 * @param t  type: valid values Gateways,Objectives,Correctives
 * @param p  LTI plan
 */
  addMultiplier(list, m, t, p){
    m[t]={}; //create a property named 't'

    list.forEach(o => {
      this.calcValue(o);
      o.YearlyValues.forEach(y=> {
        if (!m[t][y.Year]) m[t][y.Year]=0;
        y.multiplier=this.getMultiplier(o,y);
        y.weightedmultiplier=this.getWeightedMultiplier(o,y); 
        m[t][y.Year]+=y.weightedmultiplier;
    });
    });
}



/**
 * Calculates all multiplies
 * @param p LTI plan
 */
calculateAllMultipliers(p){
  let grandMultipliers={};
  this.addMultiplier(p.Gateways, grandMultipliers, "Gateways", p);
  this.addMultiplier(p.Objectives, grandMultipliers, "Objectives",p);
  this.addMultiplier(p.Correctives, grandMultipliers, "Correctives",p);


  let byYaerMultiplierList=[];
  for(var y=p.YearStart;y<=p.YearEnd;y++) {
    let m={
      year:y,
      multipliers:{
        gateways:0.0,
        objectives:0.0,
        correctives:0.0
      }
    };

    m.multipliers.gateways=grandMultipliers["Gateways"][y];
    m.multipliers.objectives=grandMultipliers["Objectives"][y];
    m.multipliers.correctives=grandMultipliers["Correctives"][y];

    byYaerMultiplierList.push(m);
  }
  return byYaerMultiplierList;
 
  
}



/**
 * Calculates Target and Current values
 * @param o 
 */
calcValue(o){
  let rollingsum=0.0;
  let counter=0;
  let rollingsum_current=0.0;
  let counter_current=0;
  o.YearlyValues.forEach(year=> {
    rollingsum+=year.TargetValue;
    counter++;
    if (year.CurrentValue){
      rollingsum_current+=year.CurrentValue;
    }
    switch(o.ConsultationType){
        case "Average": 
           year.calcTargetValue=rollingsum/counter;
           year.calcCurrentValue=rollingsum_current/counter;
        break;
        case "Punctual": 
           year.calcTargetValue=year.TargetValue;
           year.calcCurrentValue=year.CurrentValue;
        break;
        case "Cumulative": 
        year.calcTargetValue=rollingsum;
        year.calcCurrentValue=rollingsum_current;
     break;

    };
  });
}


  Plan= {
    "CompanyId":"9AA24871-608B-4A67-B6B5-188A194A81D4",
   "Name":"LTI 2020-2023",
   "YearEnd":2023,
   "YearStart":2020,
   "RoundBonusFlag":"Up",
   "RoundBonusValue":10.0000,
   "ActivationDate":null,
   "Note":null,
   "Clauses":null,
   "Document":null,
   "CorrectiveThresholdMax":0.0,
   "CorrectiveThresholdMin":0.0,
   "CorrectiveType":"Rolling",
   "Date":"2020-02-27T00:00:00",
   "PayoutStructure":
      {"PayoutType":"Cash, Equity",
       "PayoutYearEnd":2024,
       "PayoutYearStart":2021,
       "Rows":
         [
           {"AccrueYear":2020,
            "PayoutValues":
             [
               {"PayoutYear":2020,
               "Cash":0.0,
               "Equity":0.0},
              {"PayoutYear":2021,
               "Cash":0.10,
               "Equity":0.20},
               {"PayoutYear":2022,
               "Cash":0.15,
               "Equity":0.25},
              {"PayoutYear":2023,
               "Cash":0.10,
               "Equity":0.20},
               {"PayoutYear":2024,
               "Cash":0.0,
               "Equity":0.0}
             ]
            },
            {"AccrueYear":2021,
            "PayoutValues":
             [
              {"PayoutYear":2021,
               "Cash":0.10,
               "Equity":0.20},
               {"PayoutYear":2022,
               "Cash":0.15,
               "Equity":0.25},
              {"PayoutYear":2023,
               "Cash":0.10,
               "Equity":0.20},
               {"PayoutYear":2024,
               "Cash":0.0,
               "Equity":0.0}
             ]
            },
            {"AccrueYear":2022,
            "PayoutValues":
             [
             {"PayoutYear":2022,
               "Cash":0.10,
               "Equity":0.20},
              {"PayoutYear":2023,
               "Cash":0.20,
               "Equity":0.10},
               {"PayoutYear":2024,
               "Cash":0.30,
               "Equity":0.10}
             ]
            },
            {"AccrueYear":2023,
            "PayoutValues":
             [
              {"PayoutYear":2023,
               "Cash":0.30,
               "Equity":0.20},
               {"PayoutYear":2024,
               "Cash":0.40,
               "Equity":0.10}
             ]
            }

          ]
      },
     "PartecipantsByYear":[
  {
   "Year": "2020",
   "Partecipants":[
     {
    "EmployeeId": "4E96A664-87F6-4348-B2C3-27B73EB6E245",
    "Name": "Marion",
    "Surname": "Acker",
    "TargetBonusPercentage": "0.2",	
                 "GrossAnnualSalary": 100000.0000,
  },
  {
    "EmployeeId": "FC3D3D67-1EBB-4E07-B457-630BB95B137E",
    "Name": "Achine",
    "Surname": "Royal",
    "TargetBonusPercentage": "0.3",	
                 "GrossAnnualSalary": 100000.0000,
  },
  {
    "EmployeeId": "1EE9C0B9-8D5E-4EE4-AE92-3818725A4EB6",
    "Name": "David",
    "Surname": "Abdo",
    "TargetBonusPercentage": "0.5",	
                 "GrossAnnualSalary": 50000.0000,
  },
   ]
  },
  {
    "Year": "2021",
    "Partecipants":[
      {
     "EmployeeId": "4E96A664-87F6-4348-B2C3-27B73EB6E245",
     "Name": "Marion",
     "Surname": "Acker",
     "TargetBonusPercentage": "0.2",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "FC3D3D67-1EBB-4E07-B457-630BB95B137E",
     "Name": "Achine",
     "Surname": "Royal",
     "TargetBonusPercentage": "0.3",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "1EE9C0B9-8D5E-4EE4-AE92-3818725A4EB6",
     "Name": "David",
     "Surname": "Abdo",
     "TargetBonusPercentage": "0.5",	
                  "GrossAnnualSalary": 50000.0000,
   },
    ]
   },
   {
    "Year": "2022",
    "Partecipants":[
      {
     "EmployeeId": "4E96A664-87F6-4348-B2C3-27B73EB6E245",
     "Name": "Marion",
     "Surname": "Acker",
     "TargetBonusPercentage": "0.2",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "FC3D3D67-1EBB-4E07-B457-630BB95B137E",
     "Name": "Achine",
     "Surname": "Royal",
     "TargetBonusPercentage": "0.3",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "1EE9C0B9-8D5E-4EE4-AE92-3818725A4EB6",
     "Name": "David",
     "Surname": "Abdo",
     "TargetBonusPercentage": "0.5",	
                  "GrossAnnualSalary": 50000.0000,
   },
    ]
   },
   {
    "Year": "2023",
    "Partecipants":[
      {
     "EmployeeId": "4E96A664-87F6-4348-B2C3-27B73EB6E245",
     "Name": "Marion",
     "Surname": "Acker",
     "TargetBonusPercentage": "0.2",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "FC3D3D67-1EBB-4E07-B457-630BB95B137E",
     "Name": "Achine",
     "Surname": "Royal",
     "TargetBonusPercentage": "0.3",	
                  "GrossAnnualSalary": 100000.0000,
   },
   {
     "EmployeeId": "1EE9C0B9-8D5E-4EE4-AE92-3818725A4EB6",
     "Name": "David",
     "Surname": "Abdo",
     "TargetBonusPercentage": "0.5",	
                  "GrossAnnualSalary": 50000.0000,
   },
    ]
   },
  ],
      "Gateways":[
           {
   "Index":0,
            "Name":"Sales",
            "GoalId":"A80F696D-4F84-4A06-B46F-FFE9BA560DBF",
            "MeasureId":"423A463C-C751-479D-9D7D-5F4B2ED0A8A0",
            "IsCorridor":true,
            "Min":0.80,
            "Max":1.20,
            "Floor":0.90,
            "Cap":1.10,
            "ConsultationType":"Punctual",
            "Currency":"€",
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.4,
            "YearlyValues":
              [{"Year":2020, "TargetValue":100.0, "CurrentValue":120},
               {"Year":2021, "TargetValue":200.0, "CurrentValue":200},
               {"Year":2022, "TargetValue":300.0, "CurrentValue":330},
               {"Year":2023, "TargetValue":400.0, "CurrentValue":390},
              ]
             },
                   {
   "Index":1,
            "Name":"Revenue growth rate",
            "GoalId":"6D67B6C5-3F42-478B-889D-D18C94370944",
            "MeasureId":"C7CEB538-1212-43F7-832B-95EE92B68A0C",
            "IsCorridor":true,
            "Min":0.8,
            "Max":1.2,
            "Floor":0.95,
            "Cap":1.05,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.5,
            "YearlyValues":
              [{"Year":2020, "TargetValue":0.02, "CurrentValue":0.017},
               {"Year":2021, "TargetValue":0.03, "CurrentValue":0.031},
               {"Year":2022, "TargetValue":0.04, "CurrentValue":0.045},
               {"Year":2023, "TargetValue":0.05, "CurrentValue":0.056},
              ]
             },
          
       ],
      "Objectives":[
          {
   "Index":0,
            "Name":"EVA",
            "GoalId":"467F8592-982E-41D3-B10E-D165F404A2AE",
            "MeasureId":"423A463C-C751-479D-9D7D-5F4B2ED0A8A0",
            "IsCorridor":true,
            "Min":0.80,
            "Max":1.20,
            "Floor":0.90,
            "Cap":1.10,
            "ConsultationType":"Punctual",
            "Currency":"€",
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.4,
            "YearlyValues":
              [{"Year":2020, "TargetValue":100000.0, "CurrentValue":150000},
               {"Year":2021, "TargetValue":200000.0, "CurrentValue":null},
               {"Year":2022, "TargetValue":300000.0, "CurrentValue":null},
               {"Year":2023, "TargetValue":400000.0, "CurrentValue":null},
              ]
             },
                 {
   "Index":1,
            "Name":"ROI",
            "GoalId":"6FC91804-ABA5-4439-BF70-50F5862E4D07",
            "MeasureId":"C7CEB538-1212-43F7-832B-95EE92B68A0C",
            "IsCorridor":false,
            "Min":0.0,
            "Max":0.0,
            "Floor":0.0,
            "Cap":0.0,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.5,
            "YearlyValues":
              [{"Year":2020, "TargetValue":0.09, "CurrentValue":null},
               {"Year":2021, "TargetValue":0.10, "CurrentValue":null},
               {"Year":2022, "TargetValue":0.11, "CurrentValue":null},
               {"Year":2023, "TargetValue":0.12, "CurrentValue":null},
              ]
             },
              {
   "Index":2,
            "Name":"Quality index",
            "GoalId":"98AE0348-35F1-4C9C-99B0-891271DA3396",
            "MeasureId":"416F0A9B-058F-4813-B1B2-CDFD680613A8",
            "IsCorridor":false,
            "Min":0.0,
            "Max":0.0,
            "Floor":0.0,
            "Cap":0.0,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":"06D842A4-C2CA-49D6-A375-641C32C2E87B",
            "Weight":0.1,
            "YearlyValues":
              [{"Year":2020, "TargetValue":4, "CurrentValue":null},
               {"Year":2021, "TargetValue":4, "CurrentValue":null},
               {"Year":2022, "TargetValue":5, "CurrentValue":null},
               {"Year":2023, "TargetValue":5, "CurrentValue":null},
              ]
             }
  ],
      "Correctives":[
            {
   "Index":0,
            "Name":"Waste reduction rate",
            "GoalId":"A72AAB58-ED19-48BB-9167-498325459DF1",
            "MeasureId":"C7CEB538-1212-43F7-832B-95EE92B68A0C",
            "IsCorridor":false,
            "Min":0.0,
            "Max":0.0,
            "Floor":0.0,
            "Cap":0.0,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.3,
            "YearlyValues":
              [{"Year":2020, "TargetValue":0.50, "CurrentValue":null},
               {"Year":2021, "TargetValue":0.60, "CurrentValue":null},
               {"Year":2022, "TargetValue":0.70, "CurrentValue":null},
               {"Year":2023, "TargetValue":0.80, "CurrentValue":null},]
             },
              {
   "Index":1,
            "Name":"Customer profitability score",
            "GoalId":"4AACF1D1-657A-4253-8DD3-F38FE8FDA712",
            "MeasureId":"416F0A9B-058F-4813-B1B2-CDFD680613A8",
            "IsCorridor":false,
            "Min":0.0,
            "Max":0.0,
            "Floor":0.0,
            "Cap":0.0,
            "ConsultationType":"Average",
            "Currency":null,
            "FormatId":null,
            "ScaleId":"0B64B3AA-69B1-4577-A6A8-5D28E8CF9B2A",
            "Weight":0.7,
            "YearlyValues":
              [{"Year":2020, "TargetValue":7, "CurrentValue":null},
               {"Year":2021, "TargetValue":7, "CurrentValue":null},
               {"Year":2022, "TargetValue":8, "CurrentValue":null},
               {"Year":2023, "TargetValue":9, "CurrentValue":null},]
             }
  ]
  }
}

