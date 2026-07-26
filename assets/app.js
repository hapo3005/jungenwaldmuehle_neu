const toggle=document.querySelector(".toggle");
const navigation=document.querySelector(".links");

function closeNavigation(){
  if(!toggle||!navigation)return;
  navigation.classList.remove("open");
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Navigation öffnen");
  document.body.style.overflow="";
  toggle.focus();
}

if(toggle&&navigation){
  toggle.addEventListener("click",()=>{
    const isOpen=navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(isOpen));
    toggle.setAttribute("aria-label",isOpen?"Navigation schließen":"Navigation öffnen");
    document.body.style.overflow=isOpen?"hidden":"";
    if(isOpen)navigation.querySelector("a")?.focus();
  });
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeNavigation));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeNavigation()});
}

document.querySelectorAll("[data-year]").forEach(element=>{
  element.textContent=new Date().getFullYear();
});
