import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

class ClassList{
  constructor(...names){
    this.names=new Set(names);
  }
  add(...names){
    names.forEach(name=>this.names.add(name));
  }
  remove(...names){
    names.forEach(name=>this.names.delete(name));
  }
  contains(name){
    return this.names.has(name);
  }
  toggle(name,force){
    const enabled=force===undefined?!this.contains(name):Boolean(force);
    if(enabled)this.add(name);
    else this.remove(name);
    return enabled;
  }
}

class EventTarget{
  constructor(){
    this.listeners=new Map();
  }
  addEventListener(type,listener){
    const listeners=this.listeners.get(type)||[];
    listeners.push(listener);
    this.listeners.set(type,listeners);
  }
  dispatch(type,event={}){
    event.type=type;
    event.defaultPrevented=false;
    event.preventDefault=()=>{event.defaultPrevented=true;};
    for(const listener of this.listeners.get(type)||[])listener(event);
    return event;
  }
}

class Element extends EventTarget{
  constructor(document,{classes=[],attributes={}}={}){
    super();
    this.ownerDocument=document;
    this.classList=new ClassList(...classes);
    this.attributes=new Map(Object.entries(attributes));
    this.style={
      values:new Map(),
      setProperty:(name,value)=>this.style.values.set(name,value),
    };
    this.dataset={};
    this.tabIndex=0;
    this._textContent="";
    this.childrenForQueries=[];
  }
  set textContent(value){
    this._textContent=String(value);
  }
  get textContent(){
    return this._textContent;
  }
  setAttribute(name,value){
    this.attributes.set(name,String(value));
  }
  getAttribute(name){
    return this.attributes.get(name)??null;
  }
  hasAttribute(name){
    return this.attributes.has(name);
  }
  querySelectorAll(){
    return this.childrenForQueries;
  }
  querySelector(){
    return this.childrenForQueries[0]||null;
  }
  focus(options){
    this.ownerDocument.activeElement=this;
    this.focusOptions=options;
  }
  click(detail=1){
    return this.dispatch("click",{detail});
  }
}

function createHarness({reducedMotion=false}={}){
  const document=new EventTarget();
  document.body={style:{overflow:""}};
  document.documentElement={scrollHeight:2000,classList:new ClassList()};
  document.activeElement=null;

  const toggle=new Element(document,{
    classes:["toggle"],
    attributes:{
      "aria-expanded":"false",
      "aria-label":"Navigation öffnen",
    },
  });
  const firstLink=new Element(document);
  const secondLink=new Element(document);
  const reserveLink=new Element(document);
  const navigation=new Element(document,{classes:["links"]});
  navigation.childrenForQueries=[firstLink,secondLink,reserveLink];
  const scrollButton=new Element(document,{classes:["scroll-top"]});
  scrollButton.tabIndex=-1;
  const main=new Element(document);
  const year=new Element(document);

  document.querySelector=selector=>({
    ".toggle":toggle,
    ".links":navigation,
    ".scroll-top":scrollButton,
    "#main":main,
  })[selector]||null;
  document.querySelectorAll=selector=>selector==="[data-year]"?[year]:[];

  const media={
    mobile:new EventTarget(),
    reduced:new EventTarget(),
  };
  media.mobile.matches=true;
  media.reduced.matches=reducedMotion;

  const window=new EventTarget();
  window.innerHeight=800;
  window.scrollY=0;
  window.matchMedia=query=>query.includes("prefers-reduced-motion")?media.reduced:media.mobile;
  window.scrollCalls=[];
  window.scrollTo=options=>window.scrollCalls.push(options);
  window.setTimeout=callback=>{callback();return 1;};
  const animationFrames=[];
  window.requestAnimationFrame=callback=>{
    animationFrames.push(callback);
    return animationFrames.length;
  };
  window.flushAnimationFrames=()=>{
    while(animationFrames.length)animationFrames.shift()();
  };

  const context=vm.createContext({
    console,
    Date,
    document,
    window,
  });
  const source=fs.readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
  vm.runInContext(source,context,{filename:"assets/app.js"});

  return{
    document,
    firstLink,
    main,
    media,
    navigation,
    reserveLink,
    scrollButton,
    secondLink,
    toggle,
    window,
    year,
  };
}

const runtime=createHarness();

assert.equal(runtime.scrollButton.tabIndex,-1,"Scroll-up-Button startet außerhalb der Tab-Reihenfolge");
assert.equal(runtime.scrollButton.classList.contains("is-visible"),false,"Scroll-up-Button startet unsichtbar");
assert.equal(runtime.year.textContent,String(new Date().getFullYear()),"Jahreszahl wird gesetzt");

runtime.toggle.click();
assert.equal(runtime.navigation.classList.contains("open"),true,"Navigation öffnet");
assert.equal(runtime.toggle.getAttribute("aria-expanded"),"true","Menüzustand wird angekündigt");
assert.equal(runtime.toggle.getAttribute("aria-label"),"Navigation schließen","Menübutton erhält passende Beschriftung");
assert.equal(runtime.document.body.style.overflow,"hidden","Hintergrund wird beim offenen Menü gesperrt");
assert.equal(runtime.document.activeElement,runtime.firstLink,"Fokus wechselt in das Menü");

runtime.document.dispatch("keydown",{key:"Escape"});
assert.equal(runtime.navigation.classList.contains("open"),false,"Escape schließt die Navigation");
assert.equal(runtime.toggle.getAttribute("aria-expanded"),"false","Geschlossener Menüzustand wird angekündigt");
assert.equal(runtime.document.body.style.overflow,"","Scrollsperre wird aufgehoben");
assert.equal(runtime.document.activeElement,runtime.toggle,"Fokus kehrt zum Menübutton zurück");

runtime.toggle.click();
runtime.reserveLink.focus();
const forwardTrap=runtime.document.dispatch("keydown",{key:"Tab",shiftKey:false});
assert.equal(forwardTrap.defaultPrevented,true,"Tab am Menüende wird abgefangen");
assert.equal(runtime.document.activeElement,runtime.toggle,"Fokus springt vom Menüende zum Anfang");

runtime.toggle.focus();
const backwardTrap=runtime.document.dispatch("keydown",{key:"Tab",shiftKey:true});
assert.equal(backwardTrap.defaultPrevented,true,"Umschalt+Tab am Menüanfang wird abgefangen");
assert.equal(runtime.document.activeElement,runtime.reserveLink,"Fokus springt vom Menüanfang zum Ende");

runtime.media.mobile.matches=false;
runtime.media.mobile.dispatch("change",{matches:false});
assert.equal(runtime.navigation.classList.contains("open"),false,"Desktopwechsel schließt das Mobilmenü");
assert.equal(runtime.document.body.style.overflow,"","Desktopwechsel hebt die Scrollsperre auf");

runtime.window.scrollY=600;
runtime.window.dispatch("scroll");
runtime.window.flushAnimationFrames();
assert.equal(runtime.scrollButton.classList.contains("is-visible"),true,"Scroll-up-Button wird nach dem Scrollen sichtbar");
assert.equal(runtime.scrollButton.tabIndex,0,"Sichtbarer Scroll-up-Button ist fokussierbar");
assert.equal(runtime.scrollButton.style.values.get("--scroll-progress"),"180deg","Scrollfortschritt wird korrekt dargestellt");

runtime.scrollButton.click(1);
assert.equal(runtime.window.scrollCalls.at(-1).top,0,"Pointer-Aktivierung zielt auf den Seitenanfang");
assert.equal(runtime.window.scrollCalls.at(-1).behavior,"smooth","Pointer-Aktivierung scrollt weich nach oben");

runtime.scrollButton.click(0);
assert.equal(runtime.window.scrollCalls.at(-1).top,0,"Tastatur-Aktivierung zielt auf den Seitenanfang");
assert.equal(runtime.window.scrollCalls.at(-1).behavior,"auto","Tastatur-Aktivierung vermeidet erzwungene Bewegung");
assert.equal(runtime.document.activeElement,runtime.main,"Tastatur-Aktivierung setzt den Fokus auf den Hauptinhalt");

runtime.window.scrollY=0;
runtime.window.dispatch("resize");
assert.equal(runtime.scrollButton.classList.contains("is-visible"),false,"Scroll-up-Button verschwindet am Seitenanfang");
assert.equal(runtime.scrollButton.tabIndex,-1,"Unsichtbarer Scroll-up-Button verlässt die Tab-Reihenfolge");

const reducedRuntime=createHarness({reducedMotion:true});
reducedRuntime.window.scrollY=600;
reducedRuntime.window.dispatch("resize");
reducedRuntime.scrollButton.click(1);
assert.equal(reducedRuntime.window.scrollCalls.at(-1).top,0,"Bewegungsreduzierte Aktivierung zielt auf den Seitenanfang");
assert.equal(reducedRuntime.window.scrollCalls.at(-1).behavior,"auto","Reduzierte Bewegung wird respektiert");

console.log("Laufzeitvalidierung erfolgreich: Navigation, Fokusführung, Scroll-up-Button und Bewegungsreduktion geprüft.");
