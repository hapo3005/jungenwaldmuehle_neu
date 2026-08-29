const toggle=document.querySelector(".toggle");
const navigation=document.querySelector(".links");
const mobileBreakpoint=window.matchMedia("(max-width: 980px)");
let lockedScrollY=0;
let pageScrollLocked=false;

function focusableNavigationItems(){
  if(!navigation)return[];
  return [toggle,...navigation.querySelectorAll("a,button")].filter(element=>element&&!element.hasAttribute("disabled"));
}

function lockPageScroll(){
  if(pageScrollLocked)return;
  lockedScrollY=window.scrollY;
  pageScrollLocked=true;
  document.body.style.position="fixed";
  document.body.style.top=`-${lockedScrollY}px`;
  document.body.style.left="0";
  document.body.style.right="0";
  document.body.style.width="100%";
  document.body.style.overflow="hidden";
}

function unlockPageScroll({restore=true}={}){
  if(!pageScrollLocked)return;
  pageScrollLocked=false;
  document.body.style.position="";
  document.body.style.top="";
  document.body.style.left="";
  document.body.style.right="";
  document.body.style.width="";
  document.body.style.overflow="";
  if(restore)window.scrollTo(0,lockedScrollY);
}

function closeNavigation({restoreFocus=true,restoreScroll=true}={}){
  if(!toggle||!navigation)return;
  navigation.classList.remove("open");
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Navigation öffnen");
  unlockPageScroll({restore:restoreScroll});
  if(restoreFocus&&toggle.isConnected!==false)toggle.focus();
}

if(toggle&&navigation){
  toggle.addEventListener("click",()=>{
    const isOpen=navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(isOpen));
    toggle.setAttribute("aria-label",isOpen?"Navigation schließen":"Navigation öffnen");
    if(isOpen){
      lockPageScroll();
      navigation.querySelector("a")?.focus();
    }else{
      unlockPageScroll();
    }
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
  const handleBreakpointChange=event=>{
    if(!event.matches)closeNavigation({restoreFocus:false});
  };
  if(typeof mobileBreakpoint.addEventListener==="function"){
    mobileBreakpoint.addEventListener("change",handleBreakpointChange);
  }else{
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
  window.addEventListener("pagehide",()=>unlockPageScroll({restore:false}));
  window.addEventListener("pageshow",()=>{
    if(!navigation.classList.contains("open"))unlockPageScroll({restore:false});
  });
}

document.querySelectorAll("[data-year]").forEach(element=>{
  element.textContent=new Date().getFullYear();
});

const lessonGallery=document.querySelector("#unterricht .equine-gallery");
if(lessonGallery&&!document.querySelector('link[data-reitschule-gallery]')){
  const lessonGalleryStyles=document.createElement("link");
  lessonGalleryStyles.rel="stylesheet";
  lessonGalleryStyles.href="assets/reitschule-gallery.css?v=20260802-1";
  lessonGalleryStyles.dataset.reitschuleGallery="";
  document.head.append(lessonGalleryStyles);
}

const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
const scrollTopButton=document.querySelector(".scroll-top");
if(scrollTopButton){
  let scrollFrame;
  const updateScrollTopButton=()=>{
    const viewportHeight=window.visualViewport?.height||window.innerHeight;
    const scrollable=Math.max(0,document.documentElement.scrollHeight-viewportHeight);
    const progress=scrollable?Math.min(1,window.scrollY/scrollable):0;
    const visible=window.scrollY>Math.min(420,viewportHeight*.55);
    scrollTopButton.classList.toggle("is-visible",visible);
    scrollTopButton.tabIndex=visible?0:-1;
    scrollTopButton.style.setProperty("--scroll-progress",`${progress*360}deg`);
    scrollFrame=undefined;
  };
  scrollTopButton.tabIndex=-1;
  scrollTopButton.addEventListener("click",event=>{
    const keyboardActivated=event.detail===0;
    window.scrollTo({top:0,behavior:reduceMotion.matches||keyboardActivated?"auto":"smooth"});
    if(keyboardActivated){
      const main=document.querySelector("#main");
      window.setTimeout(()=>{
        if(main){
          try{main.focus({preventScroll:true});}catch{main.focus();}
        }
      },0);
    }
  });
  const requestScrollUpdate=()=>{
    if(!scrollFrame)scrollFrame=window.requestAnimationFrame(updateScrollTopButton);
  };
  window.addEventListener("scroll",requestScrollUpdate,{passive:true});
  window.addEventListener("resize",updateScrollTopButton,{passive:true});
  window.visualViewport?.addEventListener("resize",requestScrollUpdate,{passive:true});
  updateScrollTopButton();
}

const revealTargets=[
  ...document.querySelectorAll(
    ".intro-grid > *, .food-grid > *, .menu-preview-grid > *, .horses-grid > *, .guest-reviews-head > *, .review-card, .guest-reviews-foot > *, .visit-grid > *, .content > *, .section-head > *, .horse-details > *, .steps > *, .contact > *, .map-panel > *"
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
