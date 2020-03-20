export const Scales=[
     {"Id":"dbee4d5f-5d41-487f-b4cd-a8351556c2ae","Name":"[-100,+100]","Minimum":-100,"Maximum":100},
     {"Id":"0b64b3aa-69b1-4577-a6a8-5d28e8cf9b2a","Name":"1/10","Minimum":1,"Maximum":10},
     {"Id":"4eb5de27-c6f6-439a-9523-0126f159ffe8","Name":"1/100","Minimum":1,"Maximum":100},
     {"Id":"06d842a4-c2ca-49d6-a375-641c32c2e87b","Name":"1/5","Minimum":1,"Maximum":5}
    ];

export const Formats=[
    {"Id":"1e654a26-f179-484e-ad98-b360f54293a0","Name":"K","Multiplier":1000},
    {"Id":"39bfbfc3-5a9e-46c0-9c29-0632cffd6979","Name":"mln","Multiplier":1000000}
];

export const Measures=[
    {"Id":"423a463c-c751-479d-9d7d-5f4b2ed0a8a0","Name":"currency","MeasureType":"money","EnumValues":null,"ConsultationMode":7},
    {"Id":"723175ab-5321-48b4-b514-92a015e9b04e","Name":"numeric","MeasureType":"int","EnumValues":null,"ConsultationMode":7},
    {"Id":"416f0a9b-058f-4813-b1b2-cdfd680613a8","Name":"scale","MeasureType":"scale","EnumValues":null,"ConsultationMode":5}
];

export const Goals= [
     {
       "Id":"db5bb477-9905-4d45-8db2-10047ec73093", "Name":"Sales"},
       {"Id":"03cc815b-66ad-4b20-bf9a-ce284e8a709e","Name":"Master Tableau"},
       {"Id":"4c9fbd97-88a9-49c0-a3bb-dd13e53f6b59","Name":"IT Management Excellence"}
    ];


export const Plan: object= {
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
   "Year": 2020,
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
    "Year": 2021,
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
    "Year": 2022,
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
    "Year": 2023,
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
            "Measure":
            {"MeasureId":"423A463C-C751-479D-9D7D-5F4B2ED0A8A0", "MeasureType":"money"}
            
            ,
            "IsCorridor":true,
            "Min":0.80,
            "Max":1.10,
            "Floor":0.80,
            "Cap":1.30,
            "ConsultationType":"Punctual",
            "Currency":"€",
            "FormatId":null,
            "ScaleId":null,
            "Weight":0.5,
            "YearlyValues":
              [{"Year":2020, "TargetValue":100.0, "CurrentValue":90},
               {"Year":2021, "TargetValue":200.0, "CurrentValue":200},
               {"Year":2022, "TargetValue":300.0, "CurrentValue":330},
               {"Year":2023, "TargetValue":400.0, "CurrentValue":390},
              ]
             },
                   {
   "Index":1,
            "Name":"Revenue growth rate",
            "GoalId":"6D67B6C5-3F42-478B-889D-D18C94370944",
            "Measure":
            {"MeasureId":"A2315C50-4736-41A2-ADE9-1E4A02EAAB61", "MeasureType":"%growth"}
            
            ,
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
              [{"Year":2020, "TargetValue":0.02, "CurrentValue":0.01},
               {"Year":2021, "TargetValue":0.03, "CurrentValue":0.10},
               {"Year":2022, "TargetValue":0.04, "CurrentValue":0.04},
               {"Year":2023, "TargetValue":0.05, "CurrentValue":0.05},
              ]
             },
          
       ],
      "Objectives":[
          {
   "Index":0,
            "Name":"EVA",
            "GoalId":"467F8592-982E-41D3-B10E-D165F404A2AE",
            "Measure":
            {"MeasureId":"423A463C-C751-479D-9D7D-5F4B2ED0A8A0", "MeasureType":"money"}
            
            ,
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
              [{"Year":2020, "TargetValue":100000.0, "CurrentValue":40000.0},
               {"Year":2021, "TargetValue":200000.0, "CurrentValue":180000.0},
               {"Year":2022, "TargetValue":300000.0, "CurrentValue":290000.0},
               {"Year":2023, "TargetValue":400000.0, "CurrentValue":310000.0},
              ]
             },
                 {
   "Index":1,
            "Name":"ROI",
            "GoalId":"6FC91804-ABA5-4439-BF70-50F5862E4D07",
            "Measure":
            {"MeasureId":"C7CEB538-1212-43F7-832B-95EE92B68A0C", "MeasureType":"percent"}
            
            ,
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
              [{"Year":2020, "TargetValue":0.09, "CurrentValue":0.08},
               {"Year":2021, "TargetValue":0.10, "CurrentValue":0.11},
               {"Year":2022, "TargetValue":0.11, "CurrentValue":0.12},
               {"Year":2023, "TargetValue":0.12, "CurrentValue":0.11},
              ]
             },
              {
   "Index":2,
            "Name":"Quality index",
            "GoalId":"98AE0348-35F1-4C9C-99B0-891271DA3396",
            "Measure":
            {"MeasureId":"416F0A9B-058F-4813-B1B2-CDFD680613A8", "MeasureType":"scale"}
            
            ,
            "IsCorridor":true,
            "Min":-1,
            "Max":+1,
            "Floor":0.9,
            "Cap":1.1,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":"06D842A4-C2CA-49D6-A375-641C32C2E87B",
            "Weight":0.1,
            "YearlyValues":
              [{"Year":2020, "TargetValue":4, "CurrentValue":3},
               {"Year":2021, "TargetValue":4, "CurrentValue":4},
               {"Year":2022, "TargetValue":5, "CurrentValue":4},
               {"Year":2023, "TargetValue":5, "CurrentValue":5},
              ]
             }
  ],
      "Correctives":[
            {
   "Index":0,
            "Name":"Waste reduction rate",
            "GoalId":"A72AAB58-ED19-48BB-9167-498325459DF1",
            "Measure":
            {"MeasureId":"C7CEB538-1212-43F7-832B-95EE92B68A0C", "MeasureType":"percent"}
            ,

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
              [{"Year":2020, "TargetValue":0.50, "CurrentValue":0.60},
               {"Year":2021, "TargetValue":0.60, "CurrentValue":0.50},
               {"Year":2022, "TargetValue":0.70, "CurrentValue":0.80},
               {"Year":2023, "TargetValue":0.80, "CurrentValue":0.50},]
             },
              {
   "Index":1,
            "Name":"Customer profitability score",
            "GoalId":"4AACF1D1-657A-4253-8DD3-F38FE8FDA712",
            "Measure":
            {"MeasureId":"416F0A9B-058F-4813-B1B2-CDFD680613A8", "MeasureType":"scale"}
            ,
            "IsCorridor":true,
            "Min":6,
            "Max":8,
            "Floor":0.9,
            "Cap":1.1,
            "ConsultationType":"Punctual",
            "Currency":null,
            "FormatId":null,
            "ScaleId":"0B64B3AA-69B1-4577-A6A8-5D28E8CF9B2A",
            "Weight":0.7,
            "YearlyValues":
              [{"Year":2020, "TargetValue":7, "CurrentValue":7},
               {"Year":2021, "TargetValue":7, "CurrentValue":8},
               {"Year":2022, "TargetValue":8, "CurrentValue":8},
               {"Year":2023, "TargetValue":9, "CurrentValue":9},]
             }
  ]
 }


