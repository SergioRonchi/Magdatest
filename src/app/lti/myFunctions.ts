export function calculateLTIPlanParametes(plan, useCurrentValues) {
  if(plan){ 
  plan.Multipliers = calculateAllMultipliers(plan, useCurrentValues);
  calculateBonuses(plan);
  }

}
/****************************************************************************************************** */
class RangeValue {
  constructor(value, min, max) {
    this.value = value;
    this.min = min;
    this.max = max;
  }


  value: number;
  min: number;
  max: number;

  Add(v:RangeValue) {
    this.value+=v.value;
    this.min+=v.min;
    this.max+=v.max;
  }
}

class ResultRangeValue extends RangeValue {
  constructor(value, min, max, result) {
    super(value, min, max); // call the super class constructor and pass in the name parameter
    this.result=result;
  }
  result: number;
 
}

class YearPayableDeferred {
  constructor(payYear) {

    this.PayYear=payYear;
    this.Cash=new RangeValue(0,0,0);
    this.Equity=new RangeValue(0,0,0);
  }

  PayYear: number;
  Cash: RangeValue;
  Equity: RangeValue;
}

class PayableDeferred extends YearPayableDeferred{
  constructor(accrueYear, payYear) {
    super(payYear);
    this.AccrueYear=accrueYear;
  
  }
  AccrueYear:number;
 
}

class PartecipantValueContainer  {
  constructor() {
    this.TargetBonus=0.0;
    this.Admitted= new ResultRangeValue(0,0,0,0);
    this.Accrued=new ResultRangeValue(0,0,0,0);
    this.Deferred=new ResultRangeValue(0,0,0,0);
    this.BonusBankOpening=new ResultRangeValue(0,0,0,0);
    this.BonusBankBase=new ResultRangeValue(0,0,0,0);
    this.BonusBankClosing=new ResultRangeValue(0,0,0,0);
    this.PaybleDeferredArray=[];
  }
  TargetBonus:number;
  Admitted:  ResultRangeValue;
  Accrued: ResultRangeValue;
  Deferred: ResultRangeValue;
  PaybleDeferredArray:PayableDeferred[];
  BonusBankOpening: ResultRangeValue;
  BonusBankBase: ResultRangeValue;
  BonusBankClosing: ResultRangeValue;
}

class KeyTotalMap {
  Map(year:number, cash:RangeValue, equity:RangeValue){
    if(!this[year]){
      this[year]=new  YearPayableDeferred(year);
    }

    this[year].Cash.Add(cash);
    this[year].Equity.Add(equity);

  }


}  

/****************************************************************************************************** */
/**
* Calculate all bonuses
* @param p 
*/
function calculateBonuses(p){
 
      let bonuses=[];
      let totalBonus={         
        Target:0.0,
        Admitted:0.0,
        Accrued:0.0,
      };
      let lastYear=0;
      let lastYearBonus:any;

      if(!p.PartecipantsByYear)  return;
      

      p.PartecipantsByYear.forEach( pby => {
          let yearlyBonus={
            Year:pby.Year,
            Target:0.0,
            Admitted:0.0,
            Accrued:0.0,
            PayableCash:0.0,
            PayableEquity:0.0,
            Deferred:0.0,
            PastYearsPayable:0.0,
            BonusBankOpening:0.0,
            BonusBankBase:0.0,
            BonusBankClosing:0.0,

          };
         
          let byYearMap:KeyTotalMap = new KeyTotalMap();
          let multiplierByYear = undefined;

          if (p.Multipliers) multiplierByYear=p.Multipliers.ByYear.find(x => x.year===pby.Year);
        

          let payByAccrueYear=p.PayoutStructure.Rows.find(z => z.AccrueYear===pby.Year);
         

          pby.Partecipants.forEach(part=> {
                  let partValue:PartecipantValueContainer=new PartecipantValueContainer();
                
                  if(!part.ByPayoutYearTotals)part.ByPayoutYearTotals=byYearMap;
                 
    
                  part.TargetBonus = part.TargetBonusPercentage/100 * part.GrossAnnualSalary;

                  if(!isNaN(part.TargetBonus) && p.RoundBonusValue>0) {
                    let d=p.RoundBonusValue;
                    switch(p.RoundBonusFlag){
                      case "Up":
                          part.TargetBonus=Math.ceil(part.TargetBonus/d)*d;
                        break;
                      case "Down":
                        part.TargetBonus=Math.floor(part.TargetBonus/d)*d;
                        break;
                    }
                  }
                  partValue.TargetBonus=part.TargetBonus;

                  if(multiplierByYear && multiplierByYear.multipliers.gateways) {
                    partValue.Admitted.value=part.TargetBonus*multiplierByYear.multipliers.gateways.value;
                    partValue.Admitted.min=part.TargetBonus*multiplierByYear.multipliers.gateways.min;
                    partValue.Admitted.max=part.TargetBonus*multiplierByYear.multipliers.gateways.max;
                  }
                  if(multiplierByYear && multiplierByYear.multipliers.objectives) {
                    partValue.Accrued.value=part.Values.AdmittedBonus.value*multiplierByYear.multipliers.objectives.value;
                    partValue.Accrued.min=part.Values.AdmittedBonus.value*multiplierByYear.multipliers.objectives.min;
                    partValue.Accrued.max=part.Values.AdmittedBonus.value*multiplierByYear.multipliers.objectives.max;
                  }

                  if(payByAccrueYear) {

                    payByAccrueYear.PayoutValues.forEach( payyear => {
                          let payableDeferredItem:PayableDeferred=new PayableDeferred(pby.Year,payyear.PayoutYear);
                          
                          if(part.AccruedBonus){
                                payableDeferredItem.Cash.value=part.AccruedBonus.value*payyear.Cash/100;
                                payableDeferredItem.Cash.min=part.AccruedBonus.min*payyear.Cash/100;
                                payableDeferredItem.Cash.max=part.AccruedBonus.max*payyear.Cash/100;
                          
                      
                                payableDeferredItem.Equity.value=part.AccruedBonus.value*payyear.Equity/100;
                                payableDeferredItem.Equity.min=part.AccruedBonus.min*payyear.Equity/100;
                                payableDeferredItem.Equity.max=part.AccruedBonus.max*payyear.Equity/100;
                          }
                          
                        byYearMap.Map(payyear.PayoutYear, payableDeferredItem.Cash, payableDeferredItem.Equity);

                       
                        partValue.PaybleDeferredArray.push(payableDeferredItem);
                      

                   }); // forEach PayoutValues

                  }


                  yearlyBonus.Target+=part.TargetBonus;
                  yearlyBonus.Admitted+=part.AdmittedBonus;
                  yearlyBonus.Accrued+=part.AccruedBonus;
                  yearlyBonus.PayableCash+=part.PayableCash;
                  yearlyBonus.PayableEquity+=part.PayableEquity;
                  yearlyBonus.Deferred+=part.Deferred;

                  totalBonus.Target+=part.TargetBonus;
                  totalBonus.Admitted+=part.AdmittedBonus;
                  totalBonus.Accrued+=part.AccruedBonus;

                  part.Values=partValue;
              }); // forEach Partecipants


            if(pby.Year>lastYear){
              lastYear=pby.Year;
              lastYearBonus=yearlyBonus;

            }
            bonuses.push(yearlyBonus);
      });

      let missingYear=p.PartecipantsByYear.length-(p.YearStart-p.YearEnd+1);
      if( missingYear>0){
        //assumes the last year valid for missing years
        totalBonus.Target+=lastYearBonus.Target*missingYear;
        totalBonus.Admitted+=lastYearBonus.Admitted*missingYear;
        totalBonus.Accrued+=lastYearBonus.Accrued*missingYear;
      }

      p.TotalBonus=totalBonus;
      p.Bonuses=bonuses;

       
 
}
/****************************************************************************************************** */
/**
* Calculates all multipliers
* @param p LTI plan
*/
function calculateAllMultipliers(p, useCurrentValues){
  let grandMultipliers={
      Gateways:{},
      Objectives:{},
      Correctives:{}
  };
  addMultiplier(p.Gateways, grandMultipliers.Gateways,  p, useCurrentValues);
  addMultiplier(p.Objectives, grandMultipliers.Objectives, p, useCurrentValues);
  addMultiplier(p.Correctives, grandMultipliers.Correctives, p, useCurrentValues);

  let returnObject={
    multipliers:{
      gateways: grandMultipliers.Gateways['Average'],
      objectives: grandMultipliers.Objectives['Average'],
      correctives: grandMultipliers.Correctives['Average']
    },
    ByYear:[]
  }
  let byYaerMultiplierList=[];
  for(var y=p.YearStart;y<=p.YearEnd;y++) {
    let m={
      year:y,
      multipliers:{
        gateways: {value: 0.0, min:0.0, max:0.0},
        objectives: {value: 0.0, min:0.0, max:0.0},
        correctives: {value: 0.0, min:0.0, max:0.0}
      }
    };

    m.multipliers.gateways=grandMultipliers.Gateways[y];
    m.multipliers.objectives=grandMultipliers.Objectives[y];
    m.multipliers.correctives=grandMultipliers.Correctives[y];

    byYaerMultiplierList.push(m);
  }

  returnObject.ByYear=byYaerMultiplierList;

  return returnObject;
}
/****************************************************************************************************** */
/**
* Adds a multiplier to GrandMultipliers object
* @param list list of object to scan
* @param m  GrandMultipliers object
* @param p  LTI plan
*/
function addMultiplier(list, m, p, useCurrentValues){
  let avgMultiplier={value: 0.0, min:0.0, max:0.0, count:0};

  list.forEach(o => {
        calcValue(o);
        if(o.YearlyValues) {
          o.YearlyValues.forEach(y=> {
            if (!m[y.Year]) {
              m[y.Year]={
                value:0.0,
                min:0.0,
                max:0.0
                        };
                      }

            if(useCurrentValues){
              y.multiplier=getMultiplier(o,y);
            } else {
              y.multiplier=getPartialMultiplier(o,y);
            }


            y.weightedmultiplier= getWeightedMultiplier( y.multiplier, o.Weight/100);

            m[y.Year].value+=y.weightedmultiplier.value;
            m[y.Year].min+=y.weightedmultiplier.min;
            m[y.Year].max+=y.weightedmultiplier.max;
            avgMultiplier.value+=y.weightedmultiplier.value;
            avgMultiplier.min+=y.weightedmultiplier.min;
            avgMultiplier.max+=y.weightedmultiplier.max;
            avgMultiplier.count+=o.Weight/100;
        });

      }
  });

  avgMultiplier.value/=avgMultiplier.count;
  avgMultiplier.min/=avgMultiplier.count;
  avgMultiplier.max/=avgMultiplier.count;
  m['Average']=avgMultiplier;
}
/****************************************************************************************************** */
/**
* Calculates Target and Current values
* @param o 
*/
function calcValue(o){
  let rollingsum=0.0;
  let counter=0;
  let rollingsum_current=0.0;
  let counter_current=0;
if(o.YearlyValues) {
  o.YearlyValues.forEach(year=> {
    rollingsum+=year.TargetValue;
    counter++;
    if (year.CurrentValue){
      rollingsum_current+=year.CurrentValue;
    }
    switch(o.ConsultationType){
        case 1: //Avegarage
          year.calcTargetValue=rollingsum/counter;
          year.calcCurrentValue=rollingsum_current/counter;
        break;
        case 4: //Punctual
          year.calcTargetValue=year.TargetValue;
          year.calcCurrentValue=year.CurrentValue;
        break;
        case 2: //Cumulative
        year.calcTargetValue=rollingsum;
        year.calcCurrentValue=rollingsum_current;
     break;

    }
  });
}
}
/****************************************************************************************************** */
/**
* Get multipliers without current values
* @param o 
* @param year 
*/
function getPartialMultiplier(o,year){
let multiplier={
  value:1.0,
  min:0.0,
  max:0.0
};

  if (o.IsCorridor===false) { 
    multiplier.min=1;
  }
  else {
    multiplier.min=o.Floor/100;
  }

if (o.IsCorridor===false) { 
    multiplier.max=1;
  }
  else {
    multiplier.max=o.Cap/100;
  }      
  return multiplier;
}

/****************************************************************************************************** */
/**
* Calculates a multiplier 
* @param o 
* @param year 
*/
function getMultiplier(o,year){
  let multiplier={
    value:0.0,
    min:0.0,
    max:0.0
  };


 

  if ((year.CurrentValue!=null) && (year.TargetValue!=null)) {

  if (o.Measure && o.Measure.MeasureType==="scale") { 
    
            
              if (year.calcCurrentValue <  (year.calcTargetValue + o.Min)) {
                  multiplier.value=0;
              }
              else {
                      if (o.IsCorridor===false) {
                          multiplier.value=1;
                      }
                      else {
                          if ( (year.calcCurrentValue >= (year.calcTargetValue + o.Min)) && (year.calcCurrentValue <= year.calcTargetValue)) { 
                              multiplier.value= o.Floor +  (((year.calcCurrentValue - (year.calcTargetValue + o.Min))/ (year.calcTargetValue - (year.calcTargetValue + o.Min)) )* (1-o.Floor));
                          }
                          else { 
                              let m=1+((year.calcCurrentValue - year.calcTargetValue)/((o.Max + year.calcTargetValue)- year.calcTargetValue))* (o.Cap-1);
                              multiplier.value= Math.min(m, o.Cap);
                          }
                      }
      
              }


    }  
    else { // not "scale"
        let min=o.Min/100;
        let max=o.Max/100;
        let floor=o.Floor/100;
        let cap=o.Cap/100;

      
        if (year.calcCurrentValue < year.calcTargetValue * min) {
              multiplier.value=0;
        }
        else {
              if (o.IsCorridor==false) {
                 multiplier.value=1;
              }
              else {
                  if ( (year.calcCurrentValue >= year.calcTargetValue * min) && (year.calcCurrentValue <= year.calcTargetValue)) { 
                       multiplier.value= floor+((year.calcCurrentValue - (year.calcTargetValue * min))/(year.calcTargetValue - (year.calcTargetValue * min))) * (1-floor)
                   }
                  else { 
                   let m=1+((year.calcCurrentValue - year.calcTargetValue)/((max * year.calcTargetValue)- year.calcTargetValue))* (cap-1)
                   multiplier.value= Math.min(m, cap);
                  }
              }

        }
      }
    }
  multiplier.min=multiplier.value;
  multiplier.max=multiplier.value;
  return multiplier;
}
/****************************************************************************************************** */
/**
* Calculates a weigthed multiplier 
* @param o 
* @param year 
*/
function getWeightedMultiplier(multiplier, weigth){
  let wmultiplier={
    value: multiplier.value*weigth,
    min: multiplier.min*weigth,
    max: multiplier.max*weigth,
  };

  return wmultiplier;
}




