// Runs inline in <head> before first paint so the page never flashes: applies the saved theme/accent
// (dark by default) and any saved token overrides.
// Preview flags: ?theme=dark|lame  ?accent=blood|flame|saffron  ?static=1 (no animation)
import { KEYS } from '@/lib/store';
import { ACCENTS, DEFAULT_THEME, THEMES } from '@/lib/theme-config';

export const bootScript = `(function(){
  var d=document.documentElement;d.classList.add('js');var p=new URLSearchParams(location.search),g=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
  var t=p.get('theme')||g('${KEYS.theme}');
  if(${JSON.stringify(THEMES)}.indexOf(t)<0)t='${DEFAULT_THEME}';
  d.dataset.theme=t;
  if(p.get('static')==='1')d.classList.add('static');
  var r=p.get('accent')||g('${KEYS.accent}');
  if(${JSON.stringify(ACCENTS)}.indexOf(r)>-1)d.dataset.accent=r;
  try{
    var o=JSON.parse(g('${KEYS.tokens}')||'null');
    if(o){
      var css='',b=function(s,x){var k=Object.keys(x||{});if(k.length)css+=s+'{'+k.map(function(n){return n+':'+x[n]+';'}).join('')+'}'};
      b(':root',o.shared);b(':root[data-theme="dark"]',o.dark);b(':root[data-theme="lame"]',o.lame);
      var s=document.createElement('style');s.id='token-overrides';s.textContent=css;document.head.appendChild(s);
    }
  }catch(e){}
  var bg=getComputedStyle(d).getPropertyValue('--bg').trim(),m=document.querySelector('meta[name="theme-color"]');
  if(m&&bg)m.setAttribute('content',bg);
})();`;
