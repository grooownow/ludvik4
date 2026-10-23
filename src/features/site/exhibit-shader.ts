// The exhibit stage: one fragment shader raymarches the jelly roly-poly, the
// pink studio cyclorama, the soft beam and the floor shadow. Ported verbatim
// from the approved prototype experiments/nevalyashka/stage-lab.html.
// Uniforms: uRes, uColor, uTilt, uLag, uCam, uSpin.

export const EXHIBIT_VERTEX =
  "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

export const EXHIBIT_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform vec3 uColor;
uniform vec2 uTilt;
uniform vec2 uLag;
uniform vec2 uCam;
uniform float uSpin;
// Quality ladder (exhibit-quality.ts): 1 = lighter shadow, scattering, no haze.
uniform float uLite;
uniform float uZoom;
uniform vec2 uCenter;
// 1 = draw the stage without the mascot but keep its floor shadow (stills).
uniform float uHide;

const vec3 CENTER = vec3(0.0,1.4,0.0);
// Studio beam from front-upper-left, between the mascot and the viewer, so the belly reads as volume.
const vec3 LIGHT = vec3(-0.7,0.85,1.25);
const vec3 LIGHT_COL = vec3(1.0,0.97,0.985);
mat3 toLocal;
vec3 bodyPos;
vec3 lightDir;

mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
mat3 rotZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.0,-s,c,0.0,0.0,0.0,1.0);}
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.0)/k;return min(a,b)-h*h*k*0.25;}
float smax(float a,float b,float k){return -smin(-a,-b,k);}
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return length(pa-ba*h)-r;}

// The "Classic" roly-poly without a mouth: body + head, through-hole eyes, antenna, ring hands.
float model(vec3 q){
  const float hy=2.05,hr=0.66;
  vec3 lag=vec3(uLag.x,0.0,uLag.y);
  vec3 hc=vec3(0.0,hy,0.0)+lag*0.6;
  float d=smin(length(q-vec3(0.0,1.0,0.0))-1.0,length(q-hc)-hr,0.35);
  vec2 e=vec2(abs(q.x-hc.x),q.y)-vec2(0.25,hy+0.04);
  d=smax(d,-(length(e)-0.12),0.05);
  vec3 top=vec3(0.0,hy+hr,0.0);
  vec3 tip=top+vec3(0.0,0.4,0.0)+lag*1.6;
  float ant=min(sdCap(q,top-vec3(0.0,0.15,0.0)+lag*0.6,tip-vec3(0.0,0.12,0.0),0.065),length(q-tip)-0.15);
  d=smin(d,ant,0.08);
  vec3 a=vec3(abs(q.x),q.y,q.z);
  float arm=sdCap(a,vec3(0.8,1.22,0.0),vec3(1.42,1.22,0.0),0.075);
  vec3 h=a-vec3(1.6,1.22,0.0);
  float ring=length(vec2(length(h.xy)-0.15,h.z))-0.07;
  return smin(d,smin(arm,ring,0.05),0.12);
}
float map(vec3 p){return model(toLocal*(p-bodyPos)+vec3(0.0,1.0,0.0));}
vec3 normalAt(vec3 p){
  vec2 e=vec2(0.0015,-0.0015);
  return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));
}

// Wide soft beam through the mascot: how much light reaches p (no shadows).
float lightField(vec3 p){
  vec3 v=p-CENTER;
  float along=dot(v,lightDir);
  float perp=length(v-lightDir*along);
  float w=1.6+0.25*max(along,0.0);
  return exp(-pow(perp/w,1.6))*smoothstep(11.0,2.0,along)*0.7;
}

// Seamless pink cyclorama.
vec3 wallCol(vec3 d){ return mix(vec3(1.0,0.76,0.88),vec3(1.0,0.84,0.92),smoothstep(-0.15,0.5,d.y)); }
const vec3 FLOOR = vec3(1.0,0.74,0.87);

vec3 absorbCoef(){vec3 tint=clamp(uColor,vec3(0.02),vec3(0.995));return -log(tint)/0.9;}
vec3 floorShadow(vec3 fp){
  if(length(fp.xz)>6.0)return vec3(1.0);
  vec3 absorb=absorbCoef();
  float through=0.0,s=0.0;
  float ds=uLite>0.5?0.18:0.09;
  for(int i=0;i<40;i++){
    if(uLite>0.5&&i>=20)break;
    s+=ds;
    float pen=max(0.04,0.6*s);
    through+=clamp(0.5-map(fp+lightDir*s)/pen,0.0,1.0)*ds;
  }
  vec3 sh=exp(-absorb*through*0.9)*(1.0-0.3*clamp(through/0.9,0.0,1.0));
  float ao=0.55+0.45*smoothstep(0.0,0.6,map(fp));
  return mix(vec3(1.0),sh*ao,0.5);
}
vec3 floorCol(vec3 fp,vec3 d){
  vec3 col=(FLOOR+LIGHT_COL*lightField(fp+vec3(0.0,0.02,0.0))*0.18)*floorShadow(fp);
  // The far floor melts into the wall: no seam.
  return mix(col,wallCol(vec3(d.x,0.0,d.z)),smoothstep(5.0,16.0,length(fp.xz)));
}
vec3 envRefl(vec3 r){
  vec3 base=vec3(mix(0.8,1.0,r.y*0.5+0.5));
  float ang=acos(clamp(dot(r,lightDir),-1.0,1.0));
  return base+LIGHT_COL*(3.0*exp(-ang*ang)+30.0*exp(-pow(ang/0.28,2.0)));
}
vec3 behindColor(vec3 o,vec3 d){
  if(d.y<-0.02)return floorCol(o+d*(-o.y/d.y),d);
  return wallCol(d);
}

void main(){
  float a=uTilt.x,b=uTilt.y;
  // Spin about its own axis (drag) on top of the rocking; camera and light never move.
  toLocal=rotY(-uSpin)*rotX(-b)*rotZ(-a);
  bodyPos=vec3(-a,1.0,b);
  lightDir=normalize(LIGHT);

  float side=min(uRes.x,uRes.y);
  // uZoom enlarges the mascot over its default size; uCenter is where its
  // centre sits, as a fraction of the stage from the bottom-left.
  vec2 uv=(gl_FragCoord.xy-uRes*uCenter)/(side*uZoom);
  vec3 target=vec3(0.0,1.55,0.0);
  float yaw=uCam.x,pitch=uCam.y;
  vec3 ro=target+10.0*vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch));
  vec3 fwd=normalize(target-ro);
  vec3 right=normalize(cross(fwd,vec3(0.0,1.0,0.0)));
  vec3 up=cross(right,fwd);
  vec3 rd=normalize(fwd*1.75+right*uv.x+up*uv.y);

  float tFloor=rd.y<0.0?-ro.y/rd.y:1e5;
  float tMax=min(tFloor,20.0);
  float t=3.0,d=1.0;
  // Track the ray's closest approach: a ray that grazes the mascot without
  // hitting it still covers part of its pixel. Without this the silhouette is
  // all-or-nothing and renders as a staircase.
  // Width of one pixel per unit of t (uv is in units of side, the focal
  // length is 1.75). Rays march a body inset by 0.75 px, so the 1.5 px ramp
  // below straddles the true outline instead of starting at it — otherwise
  // hit pixels stay hard and show as steps on 1x screens.
  float pxPerT=1.0/(side*uZoom*1.75);
  float minD=1e9,tMin=t;
  for(int i=0;i<180;i++){
    d=map(ro+rd*t)+0.75*t*pxPerT;
    if(d<minD){minD=d;tMin=t;}
    if(d<0.0008*t||t>tMax)break;
    t+=d;
  }
  float hit;
  if(t<=tMax&&d<0.0008*t){
    hit=1.0;
  }else{
    float pixel=tMin*pxPerT;
    hit=1.0-smoothstep(0.0,pixel*1.5,minD);
    t=tMin;
  }
  if(uHide>0.5)hit=0.0;
  vec3 p1=ro+rd*t;

  vec3 col=rd.y<0.0?floorCol(ro+rd*tFloor,rd):wallCol(rd);

  if(hit>0.0){
    vec3 n1=normalAt(p1);
    p1-=n1*map(p1);
    p1-=n1*map(p1);
    float ior=1.4;
    vec3 absorb=absorbCoef();
    vec3 tint=clamp(uColor,vec3(0.02),vec3(0.995));
    vec3 d1=refract(rd,n1,1.0/ior);
    vec3 q=p1-n1*0.01;
    for(int i=0;i<80;i++){
      float dIn=-map(q);
      if(dIn<0.002)break;
      q+=d1*max(dIn*0.9,0.006);
    }
    vec3 p2=q;
    float chord=max(length(p2-p1),0.6);
    vec3 n2=normalAt(p2);
    vec3 d2=refract(d1,-n2,ior);
    if(dot(d2,d2)<0.0001)d2=reflect(d1,n2);
    d2=normalize(d2);
    vec3 trans=exp(-absorb*chord);
    vec3 behind=behindColor(p2,d2);

    float cosv=max(dot(n1,-rd),0.0);
    float edge=pow(1.0-cosv,5.0);
    float fresnel=0.028+0.972*edge*0.7;
    vec3 rdir=reflect(rd,n1);
    vec3 refl=envRefl(rdir)*fresnel;
    refl=mix(refl,tint*refl,0.35*edge);
    float occl=clamp(map(p1+rdir*0.25)/0.25,0.0,1.0);
    refl*=mix(tint*0.6,vec3(1.0),occl);
    refl*=mix(1.0,0.4,smoothstep(0.0,-0.6,rdir.y));

    float reach=0.6;
    vec3 scat=vec3(0.0);
    float steps=uLite>0.5?2.0:5.0;
    for(int k=0;k<5;k++){
      if(float(k)>=steps)break;
      float s=chord*(float(k)+0.5)/steps;
      vec3 m=p1+d1*s;
      float thick=0.0;
      for(int j=1;j<=5;j++){
        if(float(j)>steps)break;
        float dm=map(m+lightDir*reach/steps*float(j));
        thick+=clamp(0.5-dm/(reach/steps),0.0,1.0)*reach/steps;
      }
      scat+=exp(-thick*2.5/reach)*exp(-absorb*s)/steps;
    }
    scat*=1.0-exp(-chord/reach);
    float wrap=dot(n1,lightDir)*0.5+0.5;
    vec3 sss=mix(tint,vec3(1.0),0.1)*scat*0.75*(0.25+0.75*wrap);
    vec3 core=pow(tint,vec3(0.6))*0.18*(1.0-exp(-chord*2.0));
    // Soft falloff on the side turned away from the light, so the belly reads as volume.
    float form=0.72+0.38*clamp(wrap,0.0,1.0);
    vec3 obj=(trans*behind*(1.0-fresnel)+sss+core)*form+refl;
    col=mix(col,clamp(obj,0.0,1.0),hit);
  }

  // Barely visible haze of the beam in the air (skipped in lite mode).
  if(uLite<0.5){
    float tEnd=hit>0.5?t:min(tFloor,16.0);
    float dt=(tEnd-3.0)/28.0;
    float haze=0.0;
    for(int i=0;i<28;i++)haze+=lightField(ro+rd*(3.0+dt*(float(i)+0.5)))*dt;
    col+=LIGHT_COL*haze*0.035;
  }
  gl_FragColor=vec4(col,1.0);
}
`;

/** Mascot colour #d80e66 as linear 0..1 RGB. */
export const MASCOT_COLOR: [number, number, number] = [0.847, 0.055, 0.4];

/** Fixed camera: the stage never moves, only the mascot does. */
export const STAGE_CAMERA = { yaw: -0.25, pitch: 0.16 } as const;
