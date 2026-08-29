const safariNavigation=document.querySelector(".links");

if(safariNavigation){
  let lockedScrollY=0;
  const body=document.body;

  const lockPageScroll=()=>{
    if(body.dataset.menuScrollLocked==="true")return;
    lockedScrollY=window.scrollY;
    body.dataset.menuScrollLocked="true";
    body.style.position="fixed";
    body.style.top=`-${lockedScrollY}px`;
    body.style.left="0";
    body.style.right="0";
    body.style.width="100%";
    body.style.overflow="hidden";
  };

  const unlockPageScroll=({restore=true}={})=>{
    if(body.dataset.menuScrollLocked!=="true")return;
    delete body.dataset.menuScrollLocked;
    body.style.position="";
    body.style.top="";
    body.style.left="";
    body.style.right="";
    body.style.width="";
    body.style.overflow="";
    if(restore)window.scrollTo(0,lockedScrollY);
  };

  const syncMenuScrollLock=()=>{
    if(safariNavigation.classList.contains("open"))lockPageScroll();
    else unlockPageScroll();
  };

  const navigationObserver=new MutationObserver(syncMenuScrollLock);
  navigationObserver.observe(safariNavigation,{attributes:true,attributeFilter:["class"]});
  syncMenuScrollLock();

  window.addEventListener("pagehide",()=>unlockPageScroll({restore:false}),{once:true});
  window.addEventListener("pageshow",()=>{
    if(!safariNavigation.classList.contains("open"))unlockPageScroll({restore:false});
  });
}
