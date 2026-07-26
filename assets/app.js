const toggle=document.querySelector(".toggle");
const navigation=document.querySelector(".links");
const mobileBreakpoint=window.matchMedia("(max-width: 980px)");

function focusableNavigationItems(){
  if(!navigation)return[];
  return [...navigation.querySelectorAll("a,button")].filter(element=>!element.hasAttribute("disabled"));
}

function closeNavigation({restoreFocus=true}={}){
  if(!toggle||!navigation)return;
  navigation.classList.remove("open");
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Navigation öffnen");
  document.body.style.overflow="";
  if(restoreFocus)toggle.focus();
}

if(toggle&&navigation){
  toggle.addEventListener("click",()=>{
    const isOpen=navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(isOpen));
    toggle.setAttribute("aria-label",isOpen?"Navigation schließen":"Navigation öffnen");
    document.body.style.overflow=isOpen?"hidden":"";
    if(isOpen)navigation.querySelector("a")?.focus();
  });
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>closeNavigation({restoreFocus:false})));
  document.addEventListener("keydown",event=>{
    if(!navigation.classList.contains("open"))return;
    if(event.key==="Escape"){
      closeNavigation();
      return;
    }
    if(event.key!=="Tab"||!mobileBreakpoint.matches)return;
    const items=focusableNavigationItems();
    if(!items.length)return;
    const first=items[0];
    const last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey&&document.activeElement===last){
      event.preventDefault();
      first.focus();
    }
  });
  mobileBreakpoint.addEventListener("change",event=>{
    if(!event.matches)closeNavigation({restoreFocus:false});
  });
}

document.querySelectorAll("[data-year]").forEach(element=>{
  element.textContent=new Date().getFullYear();
});

const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets=[
  ...document.querySelectorAll(
    ".intro-grid > *, .food-grid > *, .menu-preview-grid > *, .horses-grid > *, .visit-grid > *, .content > *, .section-head > *, .horse-details > *, .steps > *, .contact > *, .map-panel > *"
  )
];

if("IntersectionObserver" in window&&!reduceMotion.matches&&revealTargets.length){
  document.documentElement.classList.add("reveal-ready");
  revealTargets.forEach((element,index)=>{
    element.dataset.reveal="";
    element.style.setProperty("--reveal-delay",`${(index%3)*55}ms`);
  });
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },{rootMargin:"0px 0px -8% 0px",threshold:.08});
  revealTargets.forEach(element=>revealObserver.observe(element));
}
