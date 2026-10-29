import { CONFIG, DAYS } from './config.mjs';
export { CONFIG, DAYS };
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
export function seededRandom(seed=1){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}};
export function dayPlan(day){if(day<=10)return DAYS[Math.max(0,day-1)];const previous=DAYS[9];return {...previous,day,customers:Math.min(48,28+(day-10)),target:Math.min(36,21+Math.floor((day-10)*.8)),tables:4,mechanic:day>=16?'Şehir restoranı: VIP ve eleştirmen':'Mahalle lokantası'}}
export class Employee {
  constructor(def,{rng=Math.random,onEvent=()=>{}}={}){
    this.id=def.id;this.name=def.name;this.role=def.role;this.traits=[...(def.traits??[])];
    this.stats={speed:60,skill:60,stamina:65,discipline:55,...def.stats};
    this.runtime={state:'idle',fatigue:0,morale:80,caughtCount:0,cooldown:10,stateElapsed:0,slackBehavior:null,shift:'full',taskId:null,...def.runtime};
    this.contract={...CONFIG.staff.roles[def.role],...def.contract};
    this.rng=rng;this.onEvent=onEvent;this.hazard=0;this.threshold=this.nextThreshold();
  }
  nextThreshold(){return -Math.log(Math.max(1e-9,1-this.rng()))}
  transition(next,details={}){const from=this.runtime.state;if(from==='fired')return false;this.runtime.state=next;this.runtime.stateElapsed=0;Object.assign(this.runtime,details);this.onEvent({type:'staffStateChanged',id:this.id,from,to:next,...details});return true}
  get available(){return ['idle','working'].includes(this.runtime.state)}
  hazardRate(ctx={}){let c=CONFIG.staff.slacking,r=this.runtime;
    const fatiguePressure=clamp((r.fatigue-(45+this.stats.stamina*.3))/30,0,1);
    return Math.min(c.maxHazardPerSecond,c.baseHazardPerSecond*(1+(1-this.stats.discipline/100)*c.disciplineWeight+fatiguePressure*c.fatigueWeight+(1-r.morale/100)*c.moraleWeight)*(ctx.security?.85:1));
  }
  speedMultiplier(ctx={}){return (.65+this.stats.speed/100*.7)*(this.traits.includes('clumsy')?1.2:1)*(this.traits.includes('nightOwl')&&ctx.evening?1.3:1)*(ctx.gossip?.85:1)*(ctx.fever?1.25:1)*(1-this.runtime.fatigue/500)}
  tick(dt,ctx={}){
    if(!Number.isFinite(dt)||dt<=0||this.runtime.state==='fired')return;
    // Fixed substeps make hazard/recovery independent of renderer frame rate.
    let remaining=Math.min(dt,10);while(remaining>1e-8){const step=Math.min(remaining,.05);this.step(step,ctx);remaining-=step}
  }
  step(dt,ctx){let r=this.runtime,c=CONFIG.staff.slacking;r.stateElapsed+=dt;r.cooldown=Math.max(0,r.cooldown-dt);
    if(r.state==='caught')return;
    if(r.state==='break'){r.fatigue=clamp(r.fatigue-c.fatigueBreakRecoveryPerSecond*(1+(ctx.coffeeLevel??0)*.5)*dt);if(r.stateElapsed>=c.coffeeSeconds)this.transition('returning');return}
    if(r.state==='slacking'){r.fatigue=clamp(r.fatigue-.3*dt);if(r.stateElapsed>=(r.slackDuration??c.naturalReturnSeconds)){this.transition('returning');r.cooldown=c.cooldownSeconds}return}
    if(r.state==='returning'){if(ctx.atWork){this.transition('idle',{slackBehavior:null});r.cooldown=c.cooldownSeconds;this.hazard=0;this.threshold=this.nextThreshold()}return}
    if(ctx.offShift){if(r.state!=='idle')this.transition('idle');r.fatigue=clamp(r.fatigue-.5*dt);return}
    const desired=ctx.hasWork?'working':'idle';if(r.state!==desired)this.transition(desired);
    r.fatigue=clamp(r.fatigue+(ctx.hasWork?c.fatigueWorkingPerSecond*(1.3-this.stats.stamina/200):-c.fatigueIdleRecoveryPerSecond)*dt);
    if(r.cooldown>0)return;
    this.hazard+=this.hazardRate(ctx)*dt;
    if(this.hazard>=this.threshold){const behavior=c.behaviors[Math.floor(this.rng()*c.behaviors.length)];this.transition('slacking',{slackBehavior:behavior.id,slackDuration:behavior.duration,taskId:null});this.hazard=0;this.threshold=this.nextThreshold();}
  }
  catch({distance=Infinity,manager=false}={}){if(this.runtime.state!=='slacking'||distance>(manager?110:90))return false;this.runtime.caughtCount++;this.transition('caught');this.onEvent({type:'staffCaught',id:this.id,manager});return true}
  resolve(choice,wallet){let r=this.runtime,c=CONFIG.staff.slacking;if(r.state!=='caught')return {ok:false,reason:'notCaught'};
    if(choice==='warn'){this.stats.discipline=clamp(this.stats.discipline+c.warnDisciplineGain);r.morale=clamp(r.morale-c.warnMoraleLoss);r.cooldown=c.cooldownSeconds;this.transition('returning');return {ok:true,cost:0}}
    if(choice==='coffee'){if(wallet.cash<c.coffeeCost)return {ok:false,reason:'insufficientFunds'};wallet.cash-=c.coffeeCost;r.morale=clamp(r.morale+c.coffeeMoraleGain);this.transition('break');return {ok:true,cost:c.coffeeCost}}
    if(choice==='fire'){if(r.caughtCount<c.fireAfterCatches)return {ok:false,reason:'needsThreeCatches'};this.transition('fired',{taskId:null});return {ok:true,cost:0}}
    return {ok:false,reason:'unknownChoice'};
  }
  snapshot(){return {id:this.id,name:this.name,role:this.role,traits:[...this.traits],stats:{...this.stats},runtime:{...this.runtime},contract:{...this.contract}}}
}
export class TaskBoard {
  constructor(){this.tasks=new Map()}
  upsert(task){if(!this.tasks.has(task.id))this.tasks.set(task.id,{...task,owner:null});return this.tasks.get(task.id)}
  claim(id,employeeId){const t=this.tasks.get(id);if(!t||t.owner&&t.owner!==employeeId)return null;t.owner=employeeId;return t}
  release(employeeId){for(const t of this.tasks.values())if(t.owner===employeeId)t.owner=null}
  complete(id,employeeId){const t=this.tasks.get(id);if(!t||t.owner!==employeeId)return false;this.tasks.delete(id);return true}
  reconcile(validIds){for(const id of this.tasks.keys())if(!validIds.has(id))this.tasks.delete(id)}
}
export class ComboSystem {
  constructor(){this.count=0;this.fever=0}
  delivered({quality,patienceRatio,dropped=false}){if(quality<.85||patienceRatio<.55||dropped){this.count=0;return false}this.count++;if(this.count>=CONFIG.day.feverCombo){this.fever=CONFIG.day.feverSeconds;this.count=0;return true}return false}
  fail(){this.count=0}
  tick(dt){this.fever=Math.max(0,this.fever-dt)}
}
export class DifficultyDirector {
  constructor(){this.history=[];this.lastClubDay=-100}
  record(day){this.history.push(day);this.history=this.history.slice(-3)}
  offer(day){if(day<10||day-this.lastClubDay<3||this.history.length<3)return null;const average=k=>this.history.reduce((s,d)=>s+d[k],0)/3;if(average('serviceRate')>.9&&average('margin')>.45){this.lastClubDay=day;return {id:'gourmetClub',duration:25,arrivalMultiplier:1.35,rewardMultiplier:1.5}}return null}
}
export function ledger({sales=0,tips=0,food=0,waste=0,wages=0,rent=100,repairs=0,coffee=0,bonus=0}){
  return {sales,tips,food,waste,wages,rent,repairs,coffee,bonus,net:sales+tips+bonus-food-waste-wages-rent-repairs-coffee};
}
