/* Fajr booklet v2 — progressive enhancement, original seven articles remain untouched. */
(function() {
 "use strict";
 var d=document,b=d.body;
 var intro=d.getElementById("luxe-intro");
 var share=d.getElementById("luxe-share-list");
 var trigger=d.getElementById("luxe-share-trigger");
 var msg=d.getElementById("luxe-share-msg");
 var progress=d.getElementById("luxe-progress-fill");
 var previous=d.getElementById("luxe-previous");
 var next=d.getElementById("luxe-next");
 var counter=d.getElementById("luxe-chapter-count");
 var reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 var numerals=["١","٢","٣","٤","٥","٦","٧"];
 var arr=[],current=0,raf=0,initialized=false,entered=false;
 b.classList.add("luxe-locked");
 function enter(jump) {
   if(entered)return;
   entered=true;
   intro.classList.add("luxe-leaving");
   b.classList.remove("luxe-locked");
   b.classList.add("luxe-entered");
   setTimeout(function(){intro.remove();},reduce?20:870);
   if(jump){setTimeout(function(){go(0);},reduce?45:650);}
   else {setTimeout(function(){var top=d.getElementById("top");if(top){top.setAttribute("tabindex","-1");top.focus({preventScroll:true});}},reduce?20:300);}
 }
 d.getElementById("luxe-enter").addEventListener("click",function(){enter(false);});
 d.getElementById("luxe-start-first").addEventListener("click",function(){enter(true);});
 d.getElementById("luxe-skip").addEventListener("click",function(){enter(false);});
 intro.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();enter(false);}});
 var socialTitle="كتيّب صلاة الفجر — على نهج أهل البيت عليهم السلام";
 var canonical="https://kararaltmemy1-stack.github.io/islamic-fajr-booklet/";
 var url=(location.protocol==="http:"||location.protocol==="https:")?location.href.split("#")[0].split("?")[0]:canonical;
 d.getElementById("luxe-social-wa").href="https://api.whatsapp.com/send?text="+encodeURIComponent(socialTitle+"\n"+url);
 d.getElementById("luxe-social-tg").href="https://t.me/share/url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(socialTitle);
 d.getElementById("luxe-social-fb").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
 function pop(on){share.hidden=!on;trigger.setAttribute("aria-expanded",String(on));}
 trigger.addEventListener("click",function(e){e.stopPropagation();pop(share.hidden);});
 d.addEventListener("pointerdown",function(e){if(!e.target.closest(".luxe-share-wrap")&&!share.hidden)pop(false);});
 d.addEventListener("keydown",function(e){if(e.key==="Escape"&&!share.hidden){pop(false);trigger.focus();}});
 d.querySelector('[data-social="native"]').addEventListener("click",async function(){
   if(navigator.share){try{await navigator.share({title:socialTitle,text:"اقرأ كتيّب صلاة الفجر وشارك الأجر",url:url});}catch(e){if(e.name!=="AbortError")msg.textContent="يمكنك مشاركة الرابط من الخيارات الأخرى";}}
   else {msg.textContent="استخدم أحد روابط المشاركة أو انسخ الرابط";}
 });
 d.querySelector('[data-social="copy"]').addEventListener("click",async function(){
   try{
     if(navigator.clipboard && window.isSecureContext)await navigator.clipboard.writeText(url);
     else {
       var input=d.createElement("textarea");input.value=url;input.setAttribute("readonly","");input.style.position="fixed";input.style.top="-9999px";
       d.body.appendChild(input);input.select();var ok=d.execCommand("copy");input.remove();if(!ok)throw Error("copy failure");
     }
     msg.textContent="تم نسخ الرابط بنجاح ✓";
   }catch(e){msg.textContent="انسخ الرابط من شريط عنوان المتصفح";}
 });
 function go(index){
   if(!arr.length)return;
   index=Math.max(0,Math.min(arr.length-1,index));
   current=index;
   var target=arr[index];
   if(!target)return;
   target.classList.remove("luxe-arriving");void target.offsetWidth;target.classList.add("luxe-arriving");
   target.scrollIntoView({behavior:reduce?"instant":"smooth",block:"start"});
   try{history.replaceState(null,"","#article-"+(index+1));}catch(e){}
   display();
   setTimeout(function(){target.classList.remove("luxe-arriving");},900);
 }
 previous.addEventListener("click",function(){go(current-1);});
 next.addEventListener("click",function(){go(current+1);});
 function display(){
   if(!arr.length)return;
   previous.disabled=current<=0;
   next.disabled=current>=arr.length-1;
   counter.textContent=numerals[current]+" / "+numerals[arr.length-1];
   arr.forEach(function(item,i){item.classList.toggle("luxe-selected",i===current);});
   d.querySelectorAll('a[href^="#article-"]').forEach(function(a){
     var n=parseInt(a.hash.replace("#article-",""),10)-1;
     if(!isNaN(n)){
       a.classList.toggle("luxe-nav-active",n===current);
       if(n===current)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");
     }
   });
 }
 function onScroll(){
   raf=0;
   var h=Math.max(1,d.documentElement.scrollHeight-window.innerHeight);
   progress.style.width=Math.max(0,Math.min(100,100*window.scrollY/h))+"%";
   if(!arr.length)return;
   var best=0;
   for(var i=0;i<arr.length;i++){
     var top=arr[i].getBoundingClientRect().top;
     if(top<=window.innerHeight*.45)best=i;
   }
   if(best!==current){current=best;display();}
 }
 function observe(){
   if(!("IntersectionObserver" in window))return;
   var obs=new IntersectionObserver(function(entries){
     entries.forEach(function(entry){
       if(entry.isIntersecting){
         entry.target.classList.add("luxe-inview");
         obs.unobserve(entry.target);
       }
     });
   },{threshold:.06,rootMargin:"0px 0px 70px 0px"});
   d.querySelectorAll('#top main .book-page,#top main section:not(.book-page)').forEach(function(el){obs.observe(el);});
 }
 function initialize(){
   if(initialized)return;
   arr=Array.from(d.querySelectorAll('#top article[id^="article-"]'));
   if(arr.length!==7)return;
   initialized=true;
   var mobile=d.querySelector("#top > div.fixed.bottom-0");
   if(mobile)mobile.classList.add("luxe-mobile-nav");
   d.addEventListener("click",function(e){
     var anchor=e.target.closest && e.target.closest('a[href^="#article-"]');
     if(!anchor)return;
     var index=Number(anchor.getAttribute("href").replace("#article-",""))-1;
     if(index>=0 && index<arr.length){e.preventDefault();if(!entered)enter(false);go(index);}
   });
   observe();
   display();
   onScroll();
   if(location.hash.indexOf("#article-")===0){
     var requested=Number(location.hash.replace("#article-",""))-1;
     if(requested>=0&&requested<7) setTimeout(function(){go(requested);},reduce?30:1000);
   }
 }
 var mo=new MutationObserver(function(){initialize();if(initialized)mo.disconnect();});
 mo.observe(d.getElementById("root"),{childList:true,subtree:true});
 initialize();
 window.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(onScroll);},{passive:true});
 window.addEventListener("resize",function(){if(!raf)raf=requestAnimationFrame(onScroll);},{passive:true});
 window.addEventListener("pageshow",function(){b.classList.toggle("luxe-locked",!entered);});
})();