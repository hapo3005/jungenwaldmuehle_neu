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
