export function viewportLayout(width,height,coarse=false){
  const phone=width<=700||coarse||height<=520;
  const landscape=width>height;
  const zoom=phone?(landscape?Math.max(.62,Math.min(.84,height/500)):Math.max(.68,Math.min(.9,width/460))):Math.max(.55,Math.min((width-45)/1150,(height-90)/850));
  return {phone,landscape,zoom,anchorY:height*(phone&&!landscape?.54:.53),dprCap:phone?1.5:2};
}
export function joystickVector(clientX,clientY,rect,radius=33){
  let x=clientX-rect.left-rect.width/2,y=clientY-rect.top-rect.height/2,d=Math.hypot(x,y);
  if(d<radius*.12)return {x:0,y:0,knobX:0,knobY:0};
  if(d>radius){x=x/d*radius;y=y/d*radius}
  return {x:x/radius,y:y/radius,knobX:x,knobY:y};
}
