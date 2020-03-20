export function calculateLTIPlanParametes(plan) {
    
    plan.Multipliers = calculateAllMultipliers(plan);
    calculateBonuses(plan);
  
}
/****************************************************************************************************** */
/**
 * Calculate all bonuses
 * @param p 
 */
function calculateBonuses(p) {
        let bonuses = [];
        let totalBonus = {
          Target: 0.0,
          Admitted: 0.0,
          Accrued: 0.0,
        };
        let lastYear = 0;
        let lastYearBonus : any;

        if(!p.PartecipantsByYear)  return;
        

        p.PartecipantsByYear.forEach( pby => {
            let yearlyBonus={
              Year:pby.Year,
              Target:0.0,
              Admitted:0.0,
              Accrued:0.0,
            };
           

            let multiplierByYear=undefined;

            if (p.Multipliers) multiplierByYear=p.Multipliers.find(x => x.year==pby.Year);

            let payByAccrueYear=p.PayoutStructure.Rows.find(z => z.AccrueYear===pby.Year);
            let pay=undefined;
            if(payByAccrueYear) pay=payByAccrueYear.PayoutValues.find( v => v.PayoutYear===pby.Year)

            pby.Partecipants.forEach(part=> {
                    part.TargetBonus = part.TargetBonusPercentage/100 * part.GrossAnnualSalary;
                    if(multiplierByYear) {
                      part.AdmittedBonus = part.TargetBonus*multiplierByYear.multipliers.gateways;
                      part.AccruedBonus = part.AdmittedBonus*multiplierByYear.multipliers.objectives;
                    }
                    yearlyBonus.Target+=part.TargetBonus;
                    yearlyBonus.Admitted+=part.AdmittedBonus;
                    yearlyBonus.Accrued+=part.AccruedBonus;

                    totalBonus.Target+=part.TargetBonus;
                    totalBonus.Admitted+=part.AdmittedBonus;
                    totalBonus.Accrued+=part.AccruedBonus;

                    if(pay) {
                      part.PayableCash = part.AccruedBonus * pay.Cash;
                      part.PayableEquity = part.AccruedBonus * pay.Equity;
                    }
                });
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
function calculateAllMultipliers(p){
    let grandMultipliers={
        Gateways:{},
        Objectives:{},
        Correctives:{}
    };
    addMultiplier(p.Gateways, grandMultipliers.Gateways,  p);
    addMultiplier(p.Objectives, grandMultipliers.Objectives, p);
    addMultiplier(p.Correctives, grandMultipliers.Correctives, p);
  
  
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
  
      m.multipliers.gateways=grandMultipliers.Gateways[y];
      m.multipliers.objectives=grandMultipliers.Objectives[y];
      m.multipliers.correctives=grandMultipliers.Correctives[y];
  
      byYaerMultiplierList.push(m);
    }
    return byYaerMultiplierList;
  }
/****************************************************************************************************** */
  /**
 * Adds a multiplier to GrandMultipliers object
 * @param list list of object to scan
 * @param m  GrandMultipliers object
 * @param p  LTI plan
 */
function addMultiplier(list, m, p){
  

    list.forEach(o => {
      calcValue(o);
      o.YearlyValues.forEach(y=> {
        if (!m[y.Year]) m[y.Year]=0;
        y.multiplier=getMultiplier(o,y);
        y.weightedmultiplier= o.Weight * y.multiplier;
        m[y.Year]+=y.weightedmultiplier;
    });
    });
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
/****************************************************************************************************** */
  /**
 * Calculates a multiplier 
 * @param o 
 * @param year 
 */
function getMultiplier(o,year){
    let multiplier=0
    if ((year.CurrentValue!=null) && (year.TargetValue!=null)) {
  
      if (o.Measure.MeasureType==="scale") { 
      
                if (year.calcCurrentValue <  (year.calcTargetValue + o.Min)) {
                    multiplier=0;
                }
                else {
                        if (o.IsCorridor==false) {
                            multiplier=1;
                        }
                        else {
                            if ( (year.calcCurrentValue >= (year.calcTargetValue + o.Min)) && (year.calcCurrentValue <= year.calcTargetValue)) { 
                                multiplier= o.Floor +  (((year.calcCurrentValue - (year.calcTargetValue + o.Min))/ (year.calcTargetValue - (year.calcTargetValue + o.Min)) )* (1-o.Floor));
                            }
                            else { 
                                let m=1+((year.calcCurrentValue - year.calcTargetValue)/((o.Max + year.calcTargetValue)- year.calcTargetValue))* (o.Cap-1);
                                multiplier= Math.min(m, o.Cap);
                            }
                        }
        
                }
  

      }  
      else { // not "scale"
          if (year.calcCurrentValue < year.calcTargetValue * o.Min) {
                multiplier=0;
          }
          else {
                if (o.IsCorridor==false) {
                   multiplier=1;
                }
                else {
                    if ( (year.calcCurrentValue >= year.calcTargetValue * o.Min) && (year.calcCurrentValue <= year.calcTargetValue)) { 
                         multiplier= o.Floor+((year.calcCurrentValue - (year.calcTargetValue * o.Min))/(year.calcTargetValue - (year.calcTargetValue * o.Min))) * (1-o.Floor)
                     }
                    else { 
                     let m=1+((year.calcCurrentValue - year.calcTargetValue)/((o.Max * year.calcTargetValue)- year.calcTargetValue))* (o.Cap-1)
                     multiplier= Math.min(m, o.Cap);
                    }
                }
  
          }
        }
      }
    
    return multiplier;
  }
  
  


