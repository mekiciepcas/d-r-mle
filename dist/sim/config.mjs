// All money is fictional TRY. Durations use simulation seconds, stats use 0..100.
export const CONFIG = {
  schemaVersion: 3,
  economy: { currency: 'TRY', startCash: 800, rentPerDay: 100, portionCost: 20, dailyBonus: 250, maxDebt: 600, rescuePortions: 6 },
  day: { duration: 180, phases: ['morning','service','closing','investment'], rushWindows: [[45,75],[115,145]], feverSeconds: 18, feverCombo: 5 },
  staff: {
    states: ['idle','working','slacking','caught','break','returning','fired'],
    roles: {
      cashier: {label:'Kasiyer',wage:85,hireCost:180,unlockDay:1,tasks:['checkout'],priority:95},
      cook: { label:'Aşçı', wage:110, hireCost:280, unlockDay:1, tasks:['cook'], priority:70 },
      prep: { label:'Hazırlık elemanı', wage:65, hireCost:180, unlockDay:2, tasks:['prep'], priority:60 },
      waiter: { label:'Garson', wage:80, hireCost:150, unlockDay:1, tasks:['takeOrder','collect','serve'], priority:80 },
      dishwasher: { label:'Bulaşıkçı', wage:60, hireCost:160, unlockDay:1, tasks:['clean'], priority:90 },
      host: { label:'Karşılayıcı', wage:70, hireCost:200, unlockDay:3, tasks:['greet'], priority:50 },
      manager: { label:'Kat şefi', wage:320, hireCost:850, unlockDay:5, tasks:['supervise'], priority:100 }
    },
    traits: {
      gossip: { label:'Dedikoducu', nearbyRadius:100, coworkerSpeedMultiplier:.85 },
      clumsy: { label:'Sakar', movementMultiplier:1.2, dropChancePerDelivery:.05 },
      nightOwl: { label:'Gece kuşu', eveningSpeedMultiplier:1.3 }
    },
    slacking: {
      baseHazardPerSecond:.004, disciplineWeight:2, fatigueWeight:3, moraleWeight:1.4,
      tiredThreshold:65, fatigueWorkingPerSecond:.20, fatigueIdleRecoveryPerSecond:.07,
      fatigueBreakRecoveryPerSecond:2, cooldownSeconds:22, naturalReturnSeconds:22,
      maxHazardPerSecond:.065, coffeeCost:30, coffeeSeconds:7, warnDisciplineGain:7,
      warnMoraleLoss:12, coffeeMoraleGain:15, fireAfterCatches:3,
      behaviors: [
        {id:'phone',label:'Telefonla oyalanıyor',icon:'TEL',zone:'backDoor',duration:20},
        {id:'smoke',label:'Molayı uzatıyor',icon:'MOLA',zone:'backDoor',duration:24},
        {id:'nap',label:'Depoda uyukluyor',icon:'Zzz',zone:'stock',duration:26},
        {id:'snack',label:'Malzemeleri atıştırıyor',icon:'YEMEK',zone:'stock',duration:18},
        {id:'grumpy',label:'Müşteriye surat asıyor',icon:'...',zone:'dining',duration:16}
      ]
    },
    employeeExample: {
      id:'employee-001',definitionId:'waiter',name:'Ece',role:'waiter',traits:['clumsy'],
      stats:{speed:65,skill:70,stamina:70,discipline:48},
      runtime:{state:'idle',fatigue:10,morale:80,caughtCount:0,cooldown:0,stateElapsed:0,slackBehavior:null,shift:'full',taskId:null},
      contract:{wage:80,hireCost:150,hiredDay:2},position:{x:650,y:650}
    }
  },
  customers: [
    {id:'standard',label:'Mahalleli',unlockDay:1,patience:60,tipMultiplier:1,billMultiplier:1,partySize:1,eatSeconds:6,dirt:10,ratingPenalty:1,qualityMin:.5},
    {id:'rushed',label:'Beyaz yakalı',unlockDay:3,patience:38,tipMultiplier:2,billMultiplier:1,partySize:1,eatSeconds:4,dirt:8,ratingPenalty:2,qualityMin:.65,fastThreshold:.65},
    {id:'family',label:'Aile',unlockDay:5,patience:80,tipMultiplier:1,billMultiplier:2,partySize:3,eatSeconds:14,dirt:24,ratingPenalty:1,qualityMin:.6},
    {id:'critic',label:'Eleştirmen',unlockDay:16,patience:85,tipMultiplier:3,billMultiplier:1.5,partySize:1,eatSeconds:10,dirt:12,ratingPenalty:5,qualityMin:.95,requiresNonSlackingServer:true,reward:{hypeDays:1,arrivalMultiplier:1.5}},
    {id:'vip',label:'VIP',unlockDay:16,patience:65,tipMultiplier:2,billMultiplier:2,partySize:1,eatSeconds:8,dirt:12,ratingPenalty:3,qualityMin:.85},
    {id:'courier',label:'Kurye',unlockDay:16,patience:50,tipMultiplier:0,billMultiplier:1.4,partySize:1,eatSeconds:1,dirt:0,ratingPenalty:1,qualityMin:.7}
  ],
  upgrades:[
    {id:'speed',branch:'staff',name:'Rahat ayakkabılar',unlockDay:1,maxLevel:3,baseCost:250,costStep:200,effect:{movementAdd:35}},
    {id:'grill',branch:'kitchen',name:'Endüstriyel ızgara',unlockDay:1,maxLevel:3,baseCost:300,costStep:250,effect:{cookSecondsReduction:.7,burnGraceAdd:2}},
    {id:'dishwasher',branch:'kitchen',name:'Otomatik bulaşık',unlockDay:6,maxLevel:1,baseCost:900,costStep:0,effect:{autoCleanInterval:18}},
    {id:'fridge',branch:'kitchen',name:'Geniş malzeme dolabı',unlockDay:5,maxLevel:2,baseCost:400,costStep:250,effect:{stockCapacityAdd:24}},
    {id:'deco',branch:'dining',name:'Rahat koltuklar',unlockDay:1,maxLevel:3,baseCost:220,costStep:180,effect:{patienceAdd:20}},
    {id:'jukebox',branch:'dining',name:'Müzik kutusu',unlockDay:6,maxLevel:1,baseCost:450,costStep:0,effect:{patienceMultiplier:1.12}},
    {id:'lighting',branch:'dining',name:'Lüks aydınlatma',unlockDay:5,maxLevel:2,baseCost:380,costStep:220,effect:{tipMultiplierAdd:.15}},
    {id:'coffee',branch:'staff',name:'Kahve makinesi',unlockDay:3,maxLevel:2,baseCost:320,costStep:200,effect:{breakRecoveryMultiplierAdd:.5}},
    {id:'camera',branch:'staff',name:'Güvenlik kameraları',unlockDay:5,maxLevel:1,baseCost:550,costStep:0,effect:{slackHazardMultiplier:.85}}
  ],
  events:[
    {id:'spill',unlockDay:4,duration:30,resolve:'clean',reward:50},
    {id:'ovenFailure',unlockDay:5,duration:20,resolve:'repair',repairCost:45},
    {id:'powerOutage',unlockDay:16,duration:12,resolve:'wait',blocks:['cook']},
    {id:'inspection',unlockDay:16,duration:25,resolve:'hygiene>=75',reward:150,penalty:120},
    {id:'gourmetClub',unlockDay:10,duration:25,rewardMultiplier:1.5,maxPerDay:1,trigger:{rollingDays:3,meanServiceRate:.9,meanMargin:.45,cooldownDays:2}}
  ],
  quests:{
    micro:{id:'cleanThree',unlockDay:6,goal:3,seconds:30,rewardCash:90},
    daily:{id:'cleanShift',goal:{lostCustomers:0,uniqueStaffCatches:2},rewardCash:150,rewardXP:40},
    milestone:{id:'neighborhoodLegend',grossRevenue:10000,stars:3,rewardCash:500,rewardXP:150}
  }
};

export const DAYS = [
  {day:1,customers:12,tables:3,target:8,mix:[1,0,0],wages:0,mechanic:'Yürü • al • pişir • taşı • servis',quest:'6 doğru servis',investment:220},
  {day:2,customers:16,tables:3,target:10,mix:[1,0,0],wages:80,mechanic:'İlk garson; kaytarma ve uyarı',quest:'Bir çalışanı suçüstü yakala',investment:250},
  {day:3,customers:20,tables:4,target:12,mix:[.75,.25,0],wages:80,mechanic:'Aceleci müşteri; kahve molası',quest:'2 hızlı servis',investment:320},
  {day:4,customers:23,tables:4,target:14,mix:[.7,.3,0],wages:190,mechanic:'Aşçı işe alımı; dökülme krizi',quest:'5 servislik combo',investment:300},
  {day:5,customers:26,tables:4,target:16,mix:[.6,.25,.15],wages:190,mechanic:'Aile; prep; ızgara arızası',quest:'Bir krizi çöz',investment:550},
  {day:6,customers:28,tables:4,target:18,mix:[.6,.25,.15],wages:250,mechanic:'Mahalle lokantası; rush; bulaşık/hijyen',quest:'30 sn içinde 3 masa temizle',investment:900},
  {day:7,customers:30,tables:4,target:20,mix:[.55,.25,.2],wages:250,mechanic:'Karşılayıcı; vardiya planlama',quest:'Hiç müşteri kaybetme',investment:450},
  {day:8,customers:32,tables:4,target:22,mix:[.5,.3,.2],wages:315,mechanic:'İki rolün koordinasyonu; görev önceliği',quest:'2 farklı kaytaranı yakala',investment:550},
  {day:9,customers:34,tables:4,target:24,mix:[.5,.3,.2],wages:315,mechanic:'Stok ve akşam dalgası baskısı',quest:'Akşam 5 hızlı teslim',investment:600},
  {day:10,customers:36,tables:4,target:26,mix:[.45,.35,.2],wages:315,mechanic:'Kat şefi açılır; koşullu gurme ziyareti',quest:'Bir Fever etkinleştir',investment:850}
].map(d=>{
  // Baseline: no bonuses/upgrades; 80% patience, mean menu price 133.33; family bill x2 and portion x2.
  const meanBill=400/3*(1+d.mix[2]);
  const expectedTips=16*(d.mix[0]+2*d.mix[1]+d.mix[2]);
  const food=Math.round(d.target*20*(1+d.mix[2]));
  const sales=Math.round(d.target*meanBill),tips=Math.round(d.target*expectedTips),rent=100;
  d.mechanic=d.day===1?'Üç ocak, personel, bulaşık ve nakit kasa':d.day===2?'Prep, yoğun saat ve ödeme kuyruğu':d.day===3?'Dördüncü masa, karşılayıcı ve aceleci müşteri':d.day===5?'Kat şefi ve artan aile yoğunluğu':'Artan müşteri dalgaları, ocak ve kasa koordinasyonu';d.quest=d.target+' hesabı doğru kapat';return {...d,duration:180,sales,tips,food,rent,profit:sales+tips-food-rent-d.wages,breakEven:Math.ceil((rent+d.wages)/(meanBill+expectedTips-20*(1+d.mix[2])))};
});
