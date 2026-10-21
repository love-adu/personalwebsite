# personal site template and guide

it's also separated by feature, so if you only want to take one part, feel free.

the guide is split into three parts:

1. **functional**: buttons, add-ons, the editing process, and how to set up editing
2. **animations**: the heart transition, the intro/opening pixel ani, the pixel erase, the "I study ..." that updates/changes, boxes that open, the name click cards with languages
3. **aesthetics**: colors, dots, cursors, boxes, fonts, the dashed frames

each feature will have:

- **my code**: what's on *my* site
- **template**: the same thing but for you to copy and paste into your site
- **what to replace**: a table under each template that says what goes in each blank in the templates

anything in double curly braces is yours to replace. delete the braces too:

```
{{LIKE_THIS}}
```

so `{{Love Adu}}` becomes `yo mama`. if something isn't in braces, leave it alone.

## contents

**part 1: functional**
- [1.1 get it set up](#11-get-it-set-up)
- [1.2 the editing](#12-the-editing)
- [1.3 set up editing (the save function)](#13-set-up-editing-the-save-function)
- [1.4 buttons](#14-buttons)
- [1.5 editable list](#15-editable-list)
- [1.6 research interests](#16-research-interests)
- [1.7 work you've written (scrolling)](#17-work-youve-written-scrolling)
- [1.8 code + data boxes (resize and move)](#18-code--data-boxes-resize-and-move)
- [1.9 updates list](#19-updates-list)
- [1.10 blog posts and photos](#110-blog-posts-and-photos)
- [1.11 other stuff: head, menu, contact, cv button](#111-other-stuff-head-menu-contact-cv-button)
- [1.12 paste section](#112-paste-section)

**part 2: animations**
- [2.1 love heart transition (light/dark switch)](#21-love-heart-transition-lightdark-switch)
- [2.2 intro screen](#22-intro-screen)
- [2.3 the pixel erase](#23-the-pixel-erase)
- [2.4 the words that keep changing)](#24-the-words-that-keep-changing)
- [2.5 boxes that open](#25-boxes-that-open)
- [2.6 menu jump flash](#26-menu-jump-flash)
- [2.7 name click and the language cards](#27-name-click-and-the-language-cards)

**part 3: aesthetics**
- [3.1 colors, light and dark](#31-colors-light-and-dark)
- [3.2 background dots (paper look)](#32-background-dots-paper-look)
- [3.3 cursors](#33-cursors)
- [3.4 boxes](#34-boxes)
- [3.5 fonts](#35-fonts)
- [3.6 the dashed frame](#36-the-dashed-frame)

[stuff that's only mine, delete it](#stuff-thats-only-mine-delete-it) and [if something goes wrong](#if-something-goes-wrong) are at the bottom.

---

# part 1: functional

## 1.1 get it running

1. fork this repo (or download it and make your own)
2. in your repo go to settings, then pages, and deploy from the `main` branch, root folder
3. open `CNAME`. mine says my domain so you'll need to delete the file, or put your own domain in it
4. swap the files that are mine:
   - `Love_Adu_CV.pdf` becomes your cv (see 1.11)
   - `favicon.png` becomes your tab icon. it should be a square image, all lowercase name, same folder as `index.html` and not transparent!!
5. go through the sections below and put in your info

files in the repo:

| file | what it does |
|---|---|
| `index.html` | the site code |
| `favicon.png` | tab icon |
| `Love_Adu_CV.pdf` | what the cv button opens to |
| `CNAME` | custom domain. delete or replace depending on if you connect to editing (see 1.3) |
| `save.js` | the save function (1.3) |

editing from the live page needs the save function in 1.3. without it you can still edit `index.html` straight on github.

---

## 1.2 the editing process
*This is explaining the process of editing- to learn how to set it up, check (1.3)*

1. tap the lock icon (top right)
2. type your password
3. edit right on the page. click text and type
4. tap **save to github** in the bottom bar
5. the live site updates pretty quickly
   
if you mess up before saving, tap **discard changes**.

the bottom bar:

| button | what it does |
|---|---|
| **B** and **I** | bold and italic for selected text |
| arrows | align text left, center, or right |
| the dropdown | text size (small, normal, large, huge) |
| **save to github** | saves everything to your repo |
| **copy page html** | copies a clean copy of the page. good backup if your off wifi |
| **paste section** | swaps in a section from pasted html (1.12) |
| **discard changes** | reloads the page and drops unsaved edits |
| **log out** | locks the page again |

**don't hit select all and then type.** it replaces the whole page. if it happens, discard changes right away.

---

## 1.3 set up editing (the save function)

this is what makes the lock button and save button work by having your page send your edited html and a password to a save function. the function checks the password and writes the file to your repo through the github api.

### what you need (all free)

- a github account and the repo your site is in
- a cloudflare account (cloudflare.com, the free plan is fine)
- technically, no domain is needed since cloudflare gives you a free address that ends in `.workers.dev` but, domains are like 15-30 bucks a year for most names if you want to invest in that.

### step 1: get a github token (this is the api key)

1. on github click your profile photo, then settings
2. scroll down the left menu to developer settings
3. click personal access tokens, then fine-grained tokens, then generate new token
4. name it `site saver` and pick an expiration date (I did never, which I don't recc lol)
5. repository access: only select repositories, then pick your site repo
6. Go to permissions, then repository permissions, then contents: hit read and write
7. generate token, then copy it right away. **github only shows it once**

### step 2: make the save function

1. create a cloudfare account via your github account (https://dash.cloudflare.com/login)
2. go to the cloudflare dashboard, then workers & pages, then create, then create worker
3. name it anything (like `site`) and deploy
4. tap edit code, delete what's there, paste this, and deploy:

```js
// save function for cloudflare workers
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    const send = (status, obj) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return send(405, { message: "method not allowed" });

    try {
      const body = await request.json();
      if (body.password !== env.SITE_PASSWORD) return send(401, { message: "wrong password" });
      if (!body.html) return send(400, { message: "no html sent" });

      const path = env.GH_PATH || "index.html";
      const branch = env.GH_BRANCH || "main";
      const api = "https://api.github.com/repos/" + env.GH_OWNER + "/" + env.GH_REPO + "/contents/" + path;
      const headers = {
        Authorization: "Bearer " + env.GITHUB_TOKEN,
        Accept: "application/vnd.github+json",
        "User-Agent": "site-saver"
      };

      // read the current file so github gets its sha
      const getRes = await fetch(api + "?ref=" + branch, { headers });
      if (!getRes.ok) return send(500, { message: "couldn't read the file from github (status " + getRes.status + ")" });
      const file = await getRes.json();

      // turn the html into base64 (in chunks so big files don't crash)
      const bytes = new TextEncoder().encode(body.html);
      let bin = "";
      for (let i = 0; i < bytes.length; i += 8192) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      }

      const putRes = await fetch(api, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "update site content", content: btoa(bin), sha: file.sha, branch })
      });
      if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        return send(500, { message: err.message || "save failed (status " + putRes.status + ")" });
      }
      return send(200, { ok: true });
    } catch (err) {
      return send(500, { message: err.message });
    }
  }
};
```

### step 3: add your settings

in cloudflare open your worker, then settings, then variables and secrets, then add. add these. **pick the type "secret" for the first two so they get hidden**:

| name | value |
|---|---|
| **`SITE_PASSWORD` (secret)** | a password |
| **`GITHUB_TOKEN` (secret)** | the token from step 1 |
| `GH_OWNER` | your github username |
| `GH_REPO` | the name of your site repo |
| `GH_PATH` | optional. defaults to `index.html` |
| `GH_BRANCH` | optional. defaults to `main` |
| `ALLOWED_ORIGIN` | optional. your site address like `https://yourname.com`. leave it out to allow any site|

then deploy.

### step 4: connect it to your site

1. copy your worker's address from the top of its page. it ends in `.workers.dev`
2. in `index.html` find this line and swap in your address:

```js
var SAVE_ENDPOINT="https://your-worker-name.your-account.workers.dev/"
```

### step 5: test it

open your site, tap the lock, type your password, change a word, and tap save to github. if it says saved, check your repo for a new commit called "update site content".

### good to know

- **domain:** you don't need one for editing, it will just show your site at `yourname.github.io/repo`. if you want your own, buy one, then in your repo go to settings, pages, custom domain, and follow the dns steps github shows
- **vercel or netlify instead of cloudflare:** they work too from what I've seen, but the code is a little different. never used these before so I won't be of much help. (I tried vercel and failed lmao)
- **NEVER paste the token or password into `index.html` or the repo**
- when the token expires, make a new one and swap it in under variables and secrets, or, if you're an idiot like me, set it to never expire
- **save failed?** check the password first, then that the token has contents read and write on the right repo
---

## 1.4 buttons 

all of these only show up while you're unlocked, so unless you unlock it, nobody will ever see these including yourself. 

| where | button | what it does |
|---|---|---|
| any list line | **edit link** | asks for a web address. blank removes the link |
| any list line | **color** | cycles the title color (6 colors) |
| any list line | **remove line** | deletes the line |
| any list | **+ add line** | adds a line |
| any list | **remove list** | deletes the whole list |
| bottom of a section | **+ add list** | adds a new list with a header |
| code + data box | **shorter** / **taller** | height, 90px per tap |
| code + data box | **narrower** / **wider** | width, 10% per tap. not mobile friendly unforch |
| code + data box | **move earlier** / **move later** | changes the order |
| code + data box | **reset size** | back to the default size |
| code + data box | **remove box** | deletes the box |
| code + data section | **+ add box** | adds a new box |
| updates | **+ add update** | adds a row. the x deletes one |
| blog | **+ add post** | adds a blank post. the x deletes one |
| beyoncePal post | **upload photo** / **remove photo** | fills or clears one of the 14 photo slots (photos shrink to 700px wide always unforch) |
| beyoncePal post | **set github link** | changes where "see it on github" goes |
| language cards | flag dropdown (I didn't add all flags, I got lazy lol), **remove**, **+ add language** | edits the cards (2.7) |
| bottom bar | **paste section** | swaps in a section (1.12) |

empty lists and empty boxes are hidden from visitors.
I also made the picture enabled posts template specifically for my beyonce post, so no good template except this one lol.

### css: hides edit buttons from visitors and shows it when unlocked

```css
button.edit-only{display:none}
body.editing button.edit-only{display:inline-block}
.v-btn{border:2px solid var(--ink);background:var(--bg);color:var(--text);font:inherit;font-size:13px;font-weight:700;padding:3px 10px;cursor:pointer}
.vb,.vf{display:none;flex-wrap:wrap;gap:8px;padding-top:6px}
body.editing .vb,body.editing .vf{display:flex}
.cbar{display:none;flex-wrap:wrap;gap:6px;margin:0 0 8px}
body.editing .cbar{display:flex}
.del-btn{display:none;border:2px solid var(--ink);background:var(--bg);color:var(--text);width:22px;height:22px;line-height:1;cursor:pointer;font-size:14px;margin-left:auto;flex:none}
body.editing .del-btn{display:inline-flex;align-items:center;justify-content:center}
.lc-ed{display:none;flex-wrap:wrap;gap:6px;margin-top:8px}
body.editing .lc-ed{display:flex}
@media (max-width:700px){.cbar .wbtn{display:none}}
```

### html: list buttons

```html
<div class="vb">
  <button class="v-btn v-link edit-only" contenteditable="false">edit link</button>
  <button class="v-btn v-color edit-only" contenteditable="false">color</button>
  <button class="v-btn v-rm edit-only" contenteditable="false">remove line</button>
</div>

<div class="vf">
  <button class="v-btn v-add edit-only" contenteditable="false">+ add line</button>
  <button class="v-btn v-grm edit-only" contenteditable="false">remove list</button>
</div>

<button class="v-btn v-addgrp edit-only" contenteditable="false">+ add list</button>
```

### html: code + data box buttons

```html
<div class="cbar" contenteditable="false">
  <button class="v-btn v-box edit-only" data-b="h-" contenteditable="false">shorter</button>
  <button class="v-btn v-box edit-only" data-b="h+" contenteditable="false">taller</button>
  <button class="v-btn v-box edit-only wbtn" data-b="w-" contenteditable="false">narrower</button>
  <button class="v-btn v-box edit-only wbtn" data-b="w+" contenteditable="false">wider</button>
  <button class="v-btn v-box edit-only" data-b="ml" contenteditable="false">move earlier</button>
  <button class="v-btn v-box edit-only" data-b="mr" contenteditable="false">move later</button>
  <button class="v-btn v-box edit-only" data-b="rs" contenteditable="false">reset size</button>
  <button class="v-btn v-box edit-only" data-b="rm" contenteditable="false">remove box</button>
</div>

<button class="v-btn v-addbox edit-only" contenteditable="false">+ add box</button>
```

### html: updates, blog, photo slots, language cards, bottom bar

```html
<button class="btn edit-only" id="add-update">+ add update</button>
<button class="del-btn" aria-label="delete">×</button>

<button class="btn edit-only" id="add-post">+ add post</button>

<div class="slot">
  <img class="slotimg" alt="…" src="…">
  <div class="ph">no photo yet</div>
  <div class="cap">…</div>
  <button type="button" class="btn edit-only photo-btn" contenteditable="false">upload photo</button>
  <button type="button" class="btn edit-only photo-rm" contenteditable="false">remove photo</button>
</div>

<button type="button" class="btn edit-only gh-edit" contenteditable="false">set github link</button>

<div class="lc-ed" contenteditable="false">
  <select class="lc-sel" contenteditable="false"></select>
  <button class="v-btn lc-x edit-only" contenteditable="false">remove</button>
</div>
<div class="lang-ctl" contenteditable="false">
  <button class="v-btn lc-add edit-only" contenteditable="false">+ add language</button>
</div>

<div class="edit-bar-row">
  <span id="edit-bar-status">editing</span>
  <button id="save-github">save to github</button>
  <button id="copy-html">copy page html</button>
  <button id="paste-html">paste section</button>
  <button id="reset-edits">discard changes</button>
  <button id="done-editing">log out</button>
</div>

<div class="copy-overlay" id="paste-overlay">
  <div class="copy-inner">
    <textarea id="paste-area" placeholder="paste section html"></textarea>
    <div style="display:flex;gap:10px"><button id="paste-apply">apply</button><button id="paste-close">close</button></div>
  </div>
</div>
```

### js: builders for new lines, lists, and boxes

```js
// needs these from elsewhere on the page: isEditing(), saveEdits(), initPubs(), initShut(), pubBarUpdate()
function vBtn(cls,text){var b=document.createElement("button")
b.className="v-btn "+cls+" edit-only"
b.setAttribute("contenteditable","false")
b.textContent=text
return b}
function vNewItem(){var d=document.createElement("div")
d.className="vi"
var l=document.createElement("div")
l.className="vl"
var t=document.createElement("div")
t.className="lk"
t.textContent="new line"
l.appendChild(t)
var m=document.createElement("div")
m.className="vm"
l.appendChild(m)
d.appendChild(l)
var sm=document.createElement("div")
sm.className="vs"
d.appendChild(sm)
var b=document.createElement("div")
b.className="vb"
b.appendChild(vBtn("v-link","edit link"))
b.appendChild(vBtn("v-color","color"))
b.appendChild(vBtn("v-rm","remove line"))
d.appendChild(b)
return d}
function vNewGroup(){var g=document.createElement("div")
g.className="vgrp"
var h=document.createElement("div")
h.className="vh"
h.textContent="new list:"
g.appendChild(h)
var l=document.createElement("div")
l.className="vlist"
l.appendChild(vNewItem())
g.appendChild(l)
var f=document.createElement("div")
f.className="vf"
f.appendChild(vBtn("v-add","+ add line"))
f.appendChild(vBtn("v-grm","remove list"))
g.appendChild(f)
return g}
function vNewBox(){var c=document.createElement("div")
c.className="cbox"
var bar=document.createElement("div")
bar.className="cbar"
bar.setAttribute("contenteditable","false")
var specs=[["h-","shorter",""],["h+","taller",""],["w-","narrower","wbtn"],["w+","wider","wbtn"],["ml","move earlier",""],["mr","move later",""],["rs","reset size",""],["rm","remove box",""]]
specs.forEach(function(x){var b=document.createElement("button")
b.className="v-btn v-box edit-only"+(x[2]?" "+x[2]:"")
b.setAttribute("data-b",x[0])
b.setAttribute("contenteditable","false")
b.textContent=x[1]
bar.appendChild(b)})
var w=document.createElement("div")
w.className="pubs-wrap"
var bx=document.createElement("div")
bx.className="pubs vroot"
bx.setAttribute("tabindex","0")
bx.setAttribute("aria-label","box, scrollable")
var g=vNewGroup()
g.querySelector(".vh").textContent="new box"
bx.appendChild(g)
w.appendChild(bx)
var pb=document.createElement("div")
pb.className="pubs-bar"
pb.appendChild(document.createElement("i"))
w.appendChild(pb)
c.appendChild(bar)
c.appendChild(w)
return c}
```

### js: opening ani for when tapped

```js
function vOpen(el){var h=el.getAttribute("data-href")
if(!h)return
if(/^(mailto:|#)/i.test(h))window.location.href=h
else window.open(h,"_blank","noopener")}
document.addEventListener("click",function(e){var el=e.target.closest?e.target:null
if(!el)return
if(!isEditing()){var k=el.closest(".lk[data-href]")
if(k){vOpen(k)
return}
var hh=el.closest(".pubs .vh")
if(hh&&window.matchMedia&&window.matchMedia("(max-width:700px)").matches){var gg=hh.closest(".vgrp")
if(gg)gg.classList.toggle("shut")}
return}
var t=el.closest(".v-box, .v-addbox, .v-link, .v-color, .v-rm, .v-add, .v-grm, .v-addgrp")
if(!t)return
e.preventDefault()
if(t.classList.contains("v-addbox")){var wrapb=t.closest("section").querySelector(".cboxes")
if(wrapb){wrapb.appendChild(vNewBox())
initPubs()
initShut()
saveEdits()}
return}
if(t.classList.contains("v-box")){var cb=t.closest(".cbox")
if(!cb)return
var bx=cb.querySelector(".pubs")
var act=t.getAttribute("data-b")
if(act==="rs"){bx.style.removeProperty("--ph")
cb.style.removeProperty("--bw")}
else if(act.charAt(0)==="h"){var cur=parseInt(bx.style.getPropertyValue("--ph"),10)||460
cur+=act.charAt(1)==="+"?90:-90
cur=Math.max(160,Math.min(1400,cur))
bx.style.setProperty("--ph",cur+"px")}
else if(act.charAt(0)==="w"){var wd=parseInt(cb.style.getPropertyValue("--bw"),10)||50
wd+=act.charAt(1)==="+"?10:-10
wd=Math.max(30,Math.min(100,wd))
cb.style.setProperty("--bw",wd+"%")}
else if(act==="ml"){var pv=cb.previousElementSibling
if(pv&&pv.classList.contains("cbox"))cb.parentNode.insertBefore(cb,pv)}
else if(act==="mr"){var nx=cb.nextElementSibling
if(nx&&nx.classList.contains("cbox"))cb.parentNode.insertBefore(nx,cb)}
else if(act==="rm"){if(!confirm("remove box?"))return
cb.remove()
saveEdits()
return}
pubBarUpdate(bx)
saveEdits()
return}
var item=t.closest(".vi")
var grp=t.closest(".vgrp")
if(t.classList.contains("v-link")&&item){var k2=item.querySelector(".lk")
var u=prompt("link (blank removes it)",k2.getAttribute("data-href")||"")
if(u===null)return
u=u.trim()
if(!u){k2.removeAttribute("data-href");k2.removeAttribute("role");k2.removeAttribute("tabindex")}
else{if(!/^(https?:|mailto:|\/|#)/i.test(u))u="https://"+u
k2.setAttribute("data-href",u);k2.setAttribute("role","link");k2.setAttribute("tabindex","0")}
saveEdits()
return}
if(t.classList.contains("v-color")&&item){var cc=parseInt(item.getAttribute("data-c")||"0",10)
if(!cc)cc=Array.prototype.indexOf.call(item.parentNode.children,item)%5+1
cc=cc>=6?1:cc+1
item.setAttribute("data-c",String(cc))
saveEdits()
return}
if(t.classList.contains("v-rm")&&item){if(!confirm("remove line?"))return
item.remove()
saveEdits()
return}
if(t.classList.contains("v-add")&&grp){grp.querySelector(".vlist").appendChild(vNewItem())
saveEdits()
return}
if(t.classList.contains("v-grm")&&grp){if(!confirm("remove list?"))return
grp.remove()
saveEdits()
return}
if(t.classList.contains("v-addgrp")){t.parentNode.insertBefore(vNewGroup(),t)
saveEdits()}},true)
```

### js: updates, blog posts, and x delete button

```js
function wireDelButton(btn){btn.addEventListener("click",function(){if(!isEditing())return
var row=btn.closest("li, .post")
if(row)row.remove()
saveEdits()})}
document.querySelectorAll(".del-btn").forEach(wireDelButton)
var addUpdateBtn=document.getElementById("add-update")
if(addUpdateBtn){addUpdateBtn.addEventListener("click",function(){if(!isEditing())return
var li=document.createElement("li")
li.innerHTML='<span class="cal-date">date</span><span class="cal-what">what happened</span><button class="del-btn" aria-label="delete">&times;</button>'
calList.appendChild(li)
wireDelButton(li.querySelector(".del-btn"))
li.querySelector(".cal-date").focus()
saveEdits()})}
var addPostBtn=document.getElementById("add-post")
if(addPostBtn){addPostBtn.addEventListener("click",function(){if(!isEditing())return
var div=document.createElement("div")
div.className="post"
div.innerHTML='<details open><summary><span class="post-head"><span class="post-title">new post title</span><span class="post-subheading">subheading</span></span><span class="post-date">date</span></summary><div class="post-body"><p>post text</p></div></details><button class="del-btn" aria-label="delete">&times;</button>'
blogPosts.insertBefore(div,blogPosts.firstChild)
wireDelButton(div.querySelector(".del-btn"))
div.querySelector(".post-title").focus()
saveEdits()})}
```

### js: photo slots and the github link button (beyoncePal post)

```js
(function(){
function editing(){return document.body.classList.contains("editing")}
function pickPhoto(slot){var inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return
var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,700/im.width),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s)
c.getContext("2d").drawImage(im,0,0,c.width,c.height)
var img=slot.querySelector("img.slotimg");img.src=c.toDataURL("image/jpeg",0.72);img.hidden=false;slot.classList.remove("empty")};im.src=r.result};r.readAsDataURL(f)};inp.click()}
document.addEventListener("click",function(e){if(!editing())return
var t=e.target,q=function(s){return t.closest&&t.closest(s)}
var pb=q(".dil .photo-btn"),pi=q(".dil img.slotimg"),rb=q(".dil .photo-rm"),gb=q(".dil .gh-edit")
if(pb||pi){e.preventDefault();pickPhoto((pb||pi).closest(".slot"));return}
if(rb){e.preventDefault();var sl=rb.closest(".slot"),im=sl.querySelector("img.slotimg");im.removeAttribute("src");im.hidden=true;sl.classList.add("empty");return}
if(gb){e.preventDefault();var a=document.getElementById("dil-gh");var u=prompt("github link for the palette",a.getAttribute("href"));if(u)a.setAttribute("href",u)}})
})()
```

### js: language cards (remove, add, flag dropdown)

```js
function lcSetFlag(card,key){var k=card.querySelector(".lc-k")
if(!k)return
k.innerHTML=LC_FLAGS[key]||""
card.setAttribute("data-flag",key)}
function lcSync(){document.querySelectorAll("#lcards .lcard").forEach(function(c){var sel=c.querySelector(".lc-sel")
if(sel)sel.value=c.getAttribute("data-flag")||"uk"
c.classList.remove("flip")})}
function lcNewCard(){var c=document.createElement("div")
c.className="lcard"
c.setAttribute("role","button")
c.setAttribute("tabindex","0")
c.style.setProperty("--i",String(document.querySelectorAll("#lcards .lcard").length))
c.innerHTML='<div class="lc-in"><div class="lc-f"><div class="lc-g">hello</div></div><div class="lc-k"></div></div><div class="lc-ed" contenteditable="false"><select class="lc-sel" contenteditable="false">'+LC_OPTS+'</select><button class="v-btn lc-x edit-only" contenteditable="false">remove</button></div>'
lcSetFlag(c,"uk")
return c}
lcSync()
document.addEventListener("click",function(e){var el=e.target.closest?e.target:null
if(!el)return
if(isEditing()){var x=el.closest(".lc-x")
if(x){e.preventDefault()
var cd=x.closest(".lcard")
if(cd)cd.remove()
saveEdits()
return}
var add=el.closest(".lc-add")
if(add){e.preventDefault()
document.getElementById("lcards").appendChild(lcNewCard())
lcSync()
saveEdits()}
return}
var card=el.closest(".lcard")
if(card)card.classList.toggle("flip")})
document.addEventListener("change",function(e){var sel=e.target
if(!sel.classList||!sel.classList.contains("lc-sel")||!isEditing())return
var card=sel.closest(".lcard")
if(card){lcSetFlag(card,sel.value)
saveEdits()}})
```

### js: paste section

```js
var pasteBtn=document.getElementById("paste-html"),pasteOv=document.getElementById("paste-overlay"),pasteArea=document.getElementById("paste-area")
if(pasteBtn&&pasteOv&&pasteArea){pasteBtn.addEventListener("click",function(){pasteArea.value=""
pasteOv.classList.add("open")})
document.getElementById("paste-close").addEventListener("click",function(){pasteOv.classList.remove("open")})
document.getElementById("paste-apply").addEventListener("click",function(){var raw=pasteArea.value.trim()
if(!raw)return
var doc=new DOMParser().parseFromString("<body>"+raw+"</body>","text/html")
var secs=doc.querySelectorAll("section[id]")
if(!secs.length){alert("no section found")
return}
secs.forEach(function(ns){ns.querySelectorAll("script").forEach(function(x){x.remove()})
var id=ns.getAttribute("id")
var node=document.importNode(ns,true)
var old=document.getElementById(id)
if(old){old.parentNode.replaceChild(node,old)
return}
var afterId=ns.getAttribute("data-after")||"interests"
var after=document.getElementById(afterId)
var host=after?(after.parentNode&&after.parentNode.classList.contains("row")?after.parentNode:after):null
if(host&&host.parentNode)host.parentNode.insertBefore(node,host.nextSibling)
else if(siteWrap)siteWrap.appendChild(node)
var label=ns.getAttribute("data-nav")
if(label&&!document.querySelector('.jump a[href="#'+id+'"]')){var li=document.createElement("li")
var a=document.createElement("a")
a.setAttribute("href","#"+id)
a.textContent=label
li.appendChild(a)
var ref=document.querySelector('.jump a[href="#'+afterId+'"]')
if(ref&&ref.parentNode&&ref.parentNode.parentNode)ref.parentNode.parentNode.insertBefore(li,ref.parentNode.nextSibling)
else{var ul=document.querySelector(".jump")
if(ul)ul.appendChild(li)}}})
initPubs()
initShut()
pasteOv.classList.remove("open")
saveEdits()})}
```

---

## 1.5 editable list 

research interests, work you've written, and the code + data boxes 

### my code

```html
<div class="vgrp">
  <div class="vh">works in progress</div>
  <div class="vlist">
    <div class="vi" data-c="1">
      <div class="vl">
        <div class="lk" data-href="https://github.com/love-adu/beyoncePal" role="link" tabindex="0">beyoncePal</div>
        <div class="vm">R package, color palettes based on Beyoncé albums</div>
      </div>
      <div class="vs">there's a blog post about this further down!</div>
      <div class="vb">
        <button class="v-btn v-link edit-only" contenteditable="false">edit link</button>
        <button class="v-btn v-color edit-only" contenteditable="false">color</button>
        <button class="v-btn v-rm edit-only" contenteditable="false">remove line</button>
      </div>
    </div>
  </div>
  <div class="vf">
    <button class="v-btn v-add edit-only" contenteditable="false">+ add line</button>
    <button class="v-btn v-grm edit-only" contenteditable="false">remove list</button>
  </div>
</div>
```

### template

```html
<div class="vgrp">
  <div class="vh">{{LIST_HEADER}}</div>
  <div class="vlist">
    <div class="vi" data-c="{{COLOR_NUMBER}}">
      <div class="vl">
        <div class="lk" data-href="{{LINK}}" role="link" tabindex="0">{{TITLE}}</div>
        <div class="vm">{{SMALL_DETAILS}}</div>
      </div>
      <div class="vs">{{SUMMARY}}</div>
      <div class="vb">
        <button class="v-btn v-link edit-only" contenteditable="false">edit link</button>
        <button class="v-btn v-color edit-only" contenteditable="false">color</button>
        <button class="v-btn v-rm edit-only" contenteditable="false">remove line</button>
      </div>
    </div>
  </div>
  <div class="vf">
    <button class="v-btn v-add edit-only" contenteditable="false">+ add line</button>
    <button class="v-btn v-grm edit-only" contenteditable="false">remove list</button>
  </div>
</div>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{LIST_HEADER}}` | the header over the list | `op-eds` |
| `{{COLOR_NUMBER}}` | 1 blue, 2 orange, 3 red-pink, 4 purple, 5 green, 6 pink. delete `data-c` to let it rotate on its own | `2` |
| `{{LINK}}` | where the title opens. delete `data-href`, `role` and `tabindex` if there's no link yet | `https://yoursite.com/paper.pdf` |
| `{{TITLE}}` | the colored underlined line | `how schools police speech` |
| `{{SMALL_DETAILS}}` | small text next to it (venue, year) | `journal of law, 2025` |
| `{{SUMMARY}}` | gray text underneath. leave it empty to hide it | `a look at 200 interviews about...` |

copy the whole `<div class="vi">` block for more lines, or just tap **+ add line** while logged in.

---

## 1.6 research interests (two lists)

if it matters to you, the first list gets red arrows (what you study), the second gets blue arrows (how you study it, aka methods).

### my code

```html
<section id="interests">
  <h2><span>research interests</span></h2>
  <div class="vroot">
    <div class="vgrp vgrp-i"> …interests list (1.5)… </div>
    <div class="vsep" contenteditable="false" aria-hidden="true"><i class="r">↓</i><i class="b">↑</i></div>
    <div class="vgrp vgrp-m"> …methods list (1.5)… </div>
    <p class="vtail">a lot of it longitudinal.</p>
    <button class="v-btn v-addgrp edit-only" contenteditable="false">+ add list</button>
  </div>
</section>
```

### template

```html
<section id="interests">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <div class="vroot">
    <div class="vgrp vgrp-i"> {{FIRST_LIST_FROM_1.5}} </div>
    <div class="vsep" contenteditable="false" aria-hidden="true"><i class="r">↓</i><i class="b">↑</i></div>
    <div class="vgrp vgrp-m"> {{SECOND_LIST_FROM_1.5}} </div>
    <p class="vtail">{{CLOSING_LINE}}</p>
    <button class="v-btn v-addgrp edit-only" contenteditable="false">+ add list</button>
  </div>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{SECTION_TITLE}}` | the label on the section | `research interests` |
| `{{FIRST_LIST_FROM_1.5}}` | an editable list block (1.5) with the class `vgrp vgrp-i`. the header is your intro sentence | `i study...:` |
| `{{SECOND_LIST_FROM_1.5}}` | a second list block with the class `vgrp vgrp-m` | `i get at these with:` |
| `{{CLOSING_LINE}}` | a last plain line, or delete it, idc `<p>` | `a lot of it longitudinal.` |

arrow colors: `vgrp-i` gets red arrows and `vgrp-m` gets blue ones.

---

## 1.7 work you've written 

lists of papers, posters, op-eds. 
- on a computer it's a box that scrolls, and the scrollbar is red going down and blue going up
- on a phone, each list is a tap-to-open header and only the first one starts open.

### my code

```html
<section id="written">
  <h2><span>work i've written</span></h2>
  <p><a class="btn" href="Love_Adu_CV.pdf" download="">full cv (pdf)</a></p>
  <div class="pubs-wrap">
    <div class="pubs vroot" tabindex="0" aria-label="publications, scrollable">
      <div class="vgrp"> …list (1.5)… </div>
      <div class="vgrp"> …another list… </div>
      <button class="v-btn v-addgrp edit-only" contenteditable="false">+ add list</button>
    </div>
    <div class="pubs-bar"><i></i></div>
  </div>
</section>
```

### template

```html
<section id="written">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <div class="pubs-wrap">
    <div class="pubs vroot" tabindex="0" aria-label="{{SCREEN_READER_NAME}}, scrollable">
      <div class="vgrp"> {{LIST_FROM_1.5}} </div>
      <button class="v-btn v-addgrp edit-only" contenteditable="false">+ add list</button>
    </div>
    <div class="pubs-bar"><i></i></div>
  </div>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{SECTION_TITLE}}` | label on the section | `publications` |
| `{{SCREEN_READER_NAME}}` | header | `publications` |
| `{{LIST_FROM_1.5}}` | one or more list blocks from 1.5 | |

box height on a computer is this css. change `460px`:

```css
max-height:var(--ph,min(460px,68vh))
```

---

## 1.8 code + data boxes 

this creates separate boxes you resize and move around while logged in. they start half width so two sit side by side but on a phone they stack.

### my code

```html
<section id="code" data-after="interests" data-nav="code + data">
  <h2><span>code + data</span></h2>
  <div class="cboxes">
    <div class="cbox">
      <div class="cbar" contenteditable="false">
        <button class="v-btn v-box edit-only" data-b="h-" contenteditable="false">shorter</button>
        <button class="v-btn v-box edit-only" data-b="h+" contenteditable="false">taller</button>
        <button class="v-btn v-box edit-only wbtn" data-b="w-" contenteditable="false">narrower</button>
        <button class="v-btn v-box edit-only wbtn" data-b="w+" contenteditable="false">wider</button>
        <button class="v-btn v-box edit-only" data-b="ml" contenteditable="false">move earlier</button>
        <button class="v-btn v-box edit-only" data-b="mr" contenteditable="false">move later</button>
        <button class="v-btn v-box edit-only" data-b="rs" contenteditable="false">reset size</button>
        <button class="v-btn v-box edit-only" data-b="rm" contenteditable="false">remove box</button>
      </div>
      <div class="pubs-wrap">
        <div class="pubs vroot" tabindex="0" aria-label="code, scrollable">
          <div class="vgrp"> …list (1.5), header says "code"… </div>
        </div>
        <div class="pubs-bar"><i></i></div>
      </div>
    </div>
  </div>
  <button class="v-btn v-addbox edit-only" contenteditable="false">+ add box</button>
</section>
```

### template

```html
<section id="code" data-after="interests" data-nav="{{MENU_NAME}}">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <div class="cboxes">
    <div class="cbox">
      <div class="cbar" contenteditable="false">
        <button class="v-btn v-box edit-only" data-b="h-" contenteditable="false">shorter</button>
        <button class="v-btn v-box edit-only" data-b="h+" contenteditable="false">taller</button>
        <button class="v-btn v-box edit-only wbtn" data-b="w-" contenteditable="false">narrower</button>
        <button class="v-btn v-box edit-only wbtn" data-b="w+" contenteditable="false">wider</button>
        <button class="v-btn v-box edit-only" data-b="ml" contenteditable="false">move earlier</button>
        <button class="v-btn v-box edit-only" data-b="mr" contenteditable="false">move later</button>
        <button class="v-btn v-box edit-only" data-b="rs" contenteditable="false">reset size</button>
        <button class="v-btn v-box edit-only" data-b="rm" contenteditable="false">remove box</button>
      </div>
      <div class="pubs-wrap">
        <div class="pubs vroot" tabindex="0" aria-label="{{BOX_NAME}}, scrollable">
          <div class="vgrp"> {{LIST_FROM_1.5_WITH_HEADER_BOX_NAME}} </div>
        </div>
        <div class="pubs-bar"><i></i></div>
      </div>
    </div>
  </div>
  <button class="v-btn v-addbox edit-only" contenteditable="false">+ add box</button>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{MENU_NAME}}` | the name added to the top menu | `projects` |
| `{{SECTION_TITLE}}` | label on the section | `projects` |
| `{{BOX_NAME}}` | the box's name (also the header inside) | `code` |
| `{{LIST_FROM_1.5_WITH_HEADER_BOX_NAME}}` | a list block from 1.5 in which header is the box name | |

width and height changes are saved while you edit

---

## 1.9 updates list

### my code

```html
<section id="updates">
  <h2 class="tight"><span>updates</span></h2>
  <ul class="cal" id="cal-list">
    <li><span class="cal-date">aug 6</span><span class="cal-what">presented at the <strong>ASA CITMAS Media Sociology Symposium</strong></span><button class="del-btn" aria-label="delete">×</button></li>
  </ul>
  <button class="btn edit-only" id="add-update">+ add update</button>
</section>
```

### template

```html
<section id="updates">
  <h2 class="tight"><span>{{SECTION_TITLE}}</span></h2>
  <ul class="cal" id="cal-list">
    <li><span class="cal-date">{{DATE}}</span><span class="cal-what">{{WHAT_HAPPENED}} <strong>{{BOLD_PART}}</strong></span><button class="del-btn" aria-label="delete">×</button></li>
  </ul>
  <button class="btn edit-only" id="add-update">+ add update</button>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{SECTION_TITLE}}` | label on the section | `updates` |
| `{{DATE}}` | text in the date | `may 2026` |
| `{{WHAT_HAPPENED}}` | the plain part of the line | `gave a talk at` |
| `{{BOLD_PART}}` | the bold part, or delete the `<strong>` tags | `Berkeley Oski Hunting Day` |

jk. love oski. he's our creepy ass bear

---

## 1.10 blog posts and photo slots

posts open and close when you click the title (see 2.5).

### my code

```html
<section id="blog">
  <h2><span>my blog</span></h2>
  <p>my thoughts - some coherent, some.. not</p>
  <button class="btn edit-only" id="add-post">+ add post</button>
  <div id="blog-posts">
    <div class="post">
      <details>
        <summary>
          <span class="post-head"><span class="post-title">dangerously in love, in 14 colors</span><span class="post-subheading">an r palette made from photos of the best debut album ever</span></span>
          <span class="post-date">october 10th</span>
        </summary>
        <div class="post-body"><p>…post text…</p></div>
      </details>
      <button class="del-btn" aria-label="delete">×</button>
    </div>
  </div>
</section>
```

### template

```html
<section id="blog">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <p>{{ONE_LINE_INTRO}}</p>
  <button class="btn edit-only" id="add-post">+ add post</button>
  <div id="blog-posts">
    <div class="post">
      <details>
        <summary>
          <span class="post-head"><span class="post-title">{{POST_TITLE}}</span><span class="post-subheading">{{SUBHEADING}}</span></span>
          <span class="post-date">{{POST_DATE}}</span>
        </summary>
        <div class="post-body"><p>{{POST_TEXT}}</p></div>
      </details>
      <button class="del-btn" aria-label="delete">×</button>
    </div>
  </div>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{SECTION_TITLE}}` | label on the section | `notes` |
| `{{ONE_LINE_INTRO}}` | short line under it | `things i'm thinking about` |
| `{{POST_TITLE}}` | title of the post | `why i study platforms` |
| `{{SUBHEADING}}` | second line under the title | `a short version` |
| `{{POST_DATE}}` | date on the right | `march 3rd` |
| `{{POST_TEXT}}` | the body of text, add more `<p>` for more paragraphs | `i got into this because...` |

easiest way to write one, if you aren't a sadist who wants to edit via code: log in, tap **+ add post**, and type over the blank one.

my beyoncePal post also has 14 photo slots, a color strip, and a download button. it's built just for that post, so feel free to delete it (see the bottom of this guide) unless you want to make something like it.

---

## 1.11 head, menu, contact, cv button

### my code

```html
<!doctype html>
<html lang="en"><head>
<title>love adu</title>
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="favicon.png">
```

```html
<ul class="jump">
  <li><a href="#updates">updates</a></li>
  <li><a href="#written">work i've written</a></li>
  <li><a href="#interests">research interests</a></li>
  <li><a href="#code">code + data</a></li>
  <li><a href="#blog">my blog</a></li>
  <li><a href="#contact">say hi</a></li>
</ul>
```

```html
<section id="contact">
  <h2><span>say hi</span></h2>
  <p>Email: <a href="mailto:loveadu@berkeley.edu">loveadu@berkeley.edu</a><br>
  <a href="https://linkedin.com/in/love-adu-868458233/">LinkedIn</a></p>
</section>
```

```html
<p><a class="btn" href="Love_Adu_CV.pdf" download="">full cv (pdf)</a></p>
```

### template

```html
<!doctype html>
<html lang="{{LANGUAGE_CODE}}"><head>
<title>{{TAB_TITLE}}</title>
<link rel="icon" type="image/png" href="{{ICON_FILE}}">
<link rel="apple-touch-icon" href="{{ICON_FILE}}">
```

```html
<ul class="jump">
  <li><a href="#{{SECTION_ID}}">{{MENU_NAME}}</a></li>
</ul>
```

```html
<section id="contact">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <p>Email: <a href="mailto:{{YOUR_EMAIL}}">{{YOUR_EMAIL}}</a><br>
  <a href="{{PROFILE_LINK}}">{{PROFILE_NAME}}</a></p>
</section>
```

```html
<p><a class="btn" href="{{CV_FILE}}" download="">{{BUTTON_TEXT}}</a></p>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{LANGUAGE_CODE}}` | language the site is written in | `en` |
| `{{TAB_TITLE}}` | text on the browser tab | `love adu` |
| `{{ICON_FILE}}` | tab icon file name | `favicon.png` |
| `{{SECTION_ID}}` | the `id` of the section the menu item jumps to. **must match exactly** | `written` |
| `{{MENU_NAME}}` | the words in the menu. one `<li>` per section | `publications` |
| `{{SECTION_TITLE}}` | label on the contact section | `say hi` |
| `{{YOUR_EMAIL}}` | your email (appears twice) | `oski@berkeley.edu` |
| `{{PROFILE_LINK}}` | full web address | `https://linkedin.com/in/bigmama` |
| `{{PROFILE_NAME}}` | clickable | `LinkedIn` |
| `{{CV_FILE}}` | **exact file name of the pdf in the repo** | `Love_Adu_CV.pdf` |
| `{{BUTTON_TEXT}}` | words on the button | `cv (pdf)` |

to update your cv later, upload a new pdf with the same name to your repo and it replaces the old one. **browsers hold on to old tab icons, so close and reopen the tab if the icon doesn't change.**

---

## 1.12 paste section tool

1. log in and tap **paste section** in the bottom bar
2. paste the html block (it starts with `<section id=...`)
3. tap **apply**, then **save to github**

if the id matches a section already on the page, it replaces that section. if the id is new, it adds a new section.

### template

```html
<section id="{{SECTION_ID}}" data-after="{{PLACE_AFTER}}" data-nav="{{MENU_NAME}}">
  <h2><span>{{SECTION_TITLE}}</span></h2>
  <p>{{YOUR_TEXT}}</p>
</section>
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{SECTION_ID}}` | short lowercase id, no spaces! reuse an existing id to replace that section | `talks` |
| `{{PLACE_AFTER}}` | id of the section it should sit under | `interests` |
| `{{MENU_NAME}}` | name added to the top menu | `talks` |
| `{{SECTION_TITLE}}` | label at the top | `talks` |
| `{{YOUR_TEXT}}` | what goes in it | `i've given a few talks...` |

---

# part 2: animations

fun

## 2.1 love heart transition (light/dark switch)

when someone taps the light/dark button, the screen fills with the new theme's background and a heart made of your word of choice rotates in. the word repeats around the heart in 7 rings, it holds so people can read it for a second or so (*see exact timing below*), then it swells over the screen.

timing in the animation (it runs from 0 to 1):

- 0 to 0.3: the heart grows in
- 0.3 to 0.6: it holds and spins
- 0.6 to 1: it swells off the screen and fades
- the colors switch at 0.45

### my code

the lines you'd ever change, from `heartTransition` in `index.html`:

```js
var WORD="love adu",bg=toDark?"#121314":"#fff",blue=toDark?"#4d6bff":"#1c3fd8"
var WORDS=Math.max(6,Math.floor(L/wordLen)),RINGS=7,GAP=1.15,DEPTH=0.9
var base=Math.min(innerWidth,innerHeight)/44,duration=4800,t0=performance.now(),mid=false
var cover=t<.2?t/.2:(t<.6?1:Math.max(0,1-(t-.6)/.3))
var grow=t<.3?ease(t/.3):1,swell=t<.6?0:ease((t-.6)/.4)
var scale=base*(.2+.8*grow)*(1+swell*45),ang=t*Math.PI*3
col=(r%3===2)?blue:"#d81e2c"
```

people with reduced motion turned on skip the animation and the theme just switches. no fun :(

### template

```js
var WORD="{{ANIMATION_WORD}}",bg=toDark?"{{DARK_BACKGROUND}}":"{{LIGHT_BACKGROUND}}",blue=toDark?"{{DARK_RING_COLOR_2}}":"{{LIGHT_RING_COLOR_2}}"
var WORDS=Math.max(6,Math.floor(L/wordLen)),RINGS={{NUMBER_OF_RINGS}},GAP=1.15,DEPTH=0.9
var base=Math.min(innerWidth,innerHeight)/44,duration={{TOTAL_MILLISECONDS}},t0=performance.now(),mid=false
var scale=base*(.2+.8*grow)*(1+swell*{{HOW_BIG_IT_SWELLS}}),ang=t*Math.PI*{{HALF_TURNS}}
col=(r%3===2)?blue:"{{RING_COLOR_1}}"
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{ANIMATION_WORD}}` | a short word or name, or whatever you want really | `love adu` |
| `{{DARK_BACKGROUND}}` / `{{LIGHT_BACKGROUND}}` | the page background in each theme (match your colors in 3.1) | `#121314` / `#fff` |
| `{{DARK_RING_COLOR_2}}` / `{{LIGHT_RING_COLOR_2}}` | the second ring color | `#4d6bff` / `#1c3fd8` |
| `{{RING_COLOR_1}}` | the first ring color | `#d81e2c` |
| `{{NUMBER_OF_RINGS}}` | how many rings of words | `7` |
| `{{TOTAL_MILLISECONDS}}` | how long it takes | `4800` |
| `{{HOW_BIG_IT_SWELLS}}` | bigger number = bigger final swell | `45` |
| `{{HALF_TURNS}}` | how much it spins (3 is one and a half turns) | `3` |

---

## 2.2 intro screen

the first thing people see when they open my site is a black screen with "hi" popping in. it fades out with pixels in my sites colors after about 2 seconds and the page scroll is locked until it's gone.

### my code

```html
<div class="splash" id="splash"><b>hi</b><div class="pixels" id="pixels"></div></div>
```

css:

```css
.splash{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;animation:splash-leave .01s linear 2.15s forwards}
.splash b{font-family:"Press Start 2P","Archivo Black",sans-serif;font-weight:400;font-size:clamp(32px,10vw,130px);color:#fff;text-shadow:4px 4px 0 #d81e2c,8px 8px 0 #1c3fd8;position:relative;z-index:2;opacity:0;animation:hi-in .5s steps(5) forwards,hi-out .8s …}
@keyframes hi-in{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
@keyframes hi-out{to{opacity:0;transform:scale(1.1);filter:blur(2px)}}
@keyframes splash-leave{to{opacity:0;pointer-events:none}}
```

### template

```html
<div class="splash" id="splash"><b>{{INTRO_WORD}}</b><div class="pixels" id="pixels"></div></div>
```

```css
.splash{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;animation:splash-leave .01s linear {{SECONDS_BEFORE_IT_LEAVES}}s forwards}
.splash b{font-family:"{{INTRO_FONT}}","Archivo Black",sans-serif;font-weight:400;font-size:clamp(32px,10vw,130px);color:{{INTRO_TEXT_COLOR}};text-shadow:4px 4px 0 {{SHADOW_COLOR_1}},8px 8px 0 {{SHADOW_COLOR_2}}}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{INTRO_WORD}}` | the word on the intro screen | `hi` |
| `{{SECONDS_BEFORE_IT_LEAVES}}` | how long the intro stays before it disappears. the pixel erase (2.3) needs to finish before this | `2.15` |
| `{{INTRO_FONT}}` | add a google font name. add it to the font link at the top (3.5) | `Press Start 2P` |
| `{{INTRO_TEXT_COLOR}}` | color of the word | `#fff` |
| `{{SHADOW_COLOR_1}}` / `{{SHADOW_COLOR_2}}` | the two offset shadow colors | `#d81e2c` / `#1c3fd8` |

*to remove the intro completely, delete the `<div class="splash">` line and everything about `splash` and `pixels` in the script and css.*

---

## 2.3 the pixel erase

after the "hi" is a grid of colored squares. they flash on, then fade out from the center to the edges, which erases the screen and reveals the page. **This took years off my life to get right, so you better use it**. Just kidding. Not.

### my code

css:

```css
.pixels{position:absolute;inset:0;display:grid;grid-template-columns:repeat(44,1fr);grid-template-rows:repeat(30,1fr);z-index:1;pointer-events:none}
.pixels i{background:#0a0a0a;opacity:1;animation-name:pix;animation-duration:.6s;animation-timing-function:ease;animation-fill-mode:forwards}
@keyframes pix{4%{background:var(--pc)}100%{background:var(--pc);opacity:0}}
```

js:

```js
var GRID_COLS=44,GRID_ROWS=30
function pixelColor(light){var r=Math.random();if(r<0.55)return light?"#fff":"#0a0a0a";if(r<0.70)return light?"#0a0a0a":"#fff";if(r<0.85)return"#d81e2c";return"#1c3fd8"}
cell.style.animationDelay=(0.95+gridDist(col,row)*0.5+Math.random()*0.12)+"s"
```

### template

```css
.pixels{position:absolute;inset:0;display:grid;grid-template-columns:repeat({{COLUMNS}},1fr);grid-template-rows:repeat({{ROWS}},1fr);z-index:1;pointer-events:none}
.pixels i{background:{{STARTING_SQUARE_COLOR}};opacity:1;animation-name:pix;animation-duration:{{SECONDS_PER_SQUARE}}s;animation-timing-function:ease;animation-fill-mode:forwards}
```

```js
var GRID_COLS={{COLUMNS}},GRID_ROWS={{ROWS}}
function pixelColor(light){var r=Math.random();if(r<{{SHARE_BACKGROUND}})return light?"{{LIGHT_BACKGROUND}}":"{{DARK_BACKGROUND}}";if(r<{{SHARE_BACKGROUND_PLUS_INK}})return light?"{{LIGHT_INK}}":"{{DARK_INK}}";if(r<{{SHARE_UP_TO_ACCENT_1}})return"{{ACCENT_1}}";return"{{ACCENT_2}}"}
cell.style.animationDelay=({{START_DELAY}}+gridDist(col,row)*{{SPREAD_TIME}}+Math.random()*0.12)+"s"
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{COLUMNS}}` / `{{ROWS}}` | grid size (both the css and js lines must match) | `44` / `30` |
| `{{STARTING_SQUARE_COLOR}}` | color of the squares before they flash | `#0a0a0a` |
| `{{SECONDS_PER_SQUARE}}` | how long each square takes to fade | `.6` |
| `{{SHARE_BACKGROUND}}` | the chance a square is the page background color (randomized theme) (0.55 means 55 percent) | `0.55` |
| `{{SHARE_BACKGROUND_PLUS_INK}}` | previous number plus the chance of the ink color | `0.70` |
| `{{SHARE_UP_TO_ACCENT_1}}` | the number above plus the chance of accent 1, the rest is accent 2 | `0.85` |
| `{{LIGHT_BACKGROUND}}` / `{{DARK_BACKGROUND}}` | page backgrounds | `#fff` / `#0a0a0a` |
| `{{LIGHT_INK}}` / `{{DARK_INK}}` | the contrast color | `#0a0a0a` / `#fff` |
| `{{ACCENT_1}}` / `{{ACCENT_2}}` | your two accent colors | `#d81e2c` / `#1c3fd8` |
| `{{START_DELAY}}` | seconds before the first squares fade | `0.95` |
| `{{SPREAD_TIME}}` | seconds it takes the erase to travel from the center to the edge | `0.5` |

keep (start delay + spread time + about 0.7) under the intro's leave time in 2.2. or don't. up to you.

---

## 2.4 the major erasing (the word that keeps changing)

in my welcome text, "I study ___ at UC Berkeley", the blank is a word that gets wiped away and replaced by a new one every couple of seconds. it's called the scratch word.

### my code

html:

```html
<p>I study <span class="scratch-word" id="scratch-word"><span class="sw-text">AI and its social effects</span></span> at <a href="#interests">UC Berkeley</a>.</p>
```

css:

```css
.scratch-word{position:relative;display:inline-block;font-weight:700;vertical-align:top}
.scratch-word .sw-text{display:inline-block;clip-path:inset(0 0 0 0)}
```

js:

```js
var SCRATCH_WORDS=["platform governance","online discourse","platformification","technology and society","social media","sociology","socioeconomics","the political economy of technology","AI and its social effects","technology policy","computational social sciences"]
swText.style.transition="clip-path .16s linear"
swText.style.clipPath="inset(0 0 0 100%)"
setTimeout(function(){ …swap the word, wipe it back in… },160)
scheduleNext(2200)
scheduleNext(1000)
```

the wipe covers the old word from the left, swaps the text while it's hidden, then uncovers the new word. people with reduced motion get the new word with no wipe.

### template

```html
<p>{{SENTENCE_START}} <span class="scratch-word" id="scratch-word"><span class="sw-text">{{FIRST_WORD}}</span></span> {{SENTENCE_END}}</p>
```

```js
var SCRATCH_WORDS=["{{WORD_1}}","{{WORD_2}}","{{WORD_3}}"]
swText.style.transition="clip-path {{WIPE_SECONDS}}s linear"
setTimeout(function(){ … },{{WIPE_MILLISECONDS}})
scheduleNext({{MILLISECONDS_BETWEEN_WORDS}})
scheduleNext({{MILLISECONDS_BEFORE_THE_FIRST_CHANGE}})
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{SENTENCE_START}}` | the words before the changing word | `I study` |
| `{{FIRST_WORD}}` | the word first showing when the page loads | `AI and its social effects` |
| `{{SENTENCE_END}}` | the words after | `at UC Berkeley.` |
| `{{WORD_1}}`, `{{WORD_2}}`... | your list of words. add as many as you want, **each in quotes with a comma between** | `"platform governance"` |
| `{{WIPE_SECONDS}}` | how long the wipe takes | `.16` |
| `{{WIPE_MILLISECONDS}}` | same time in milliseconds (the number in the `setTimeout`) | `160` |
| `{{MILLISECONDS_BETWEEN_WORDS}}` | how often it changes | `2200` |
| `{{MILLISECONDS_BEFORE_THE_FIRST_CHANGE}}` | wait before the first change | `1000` |

---

## 2.5 boxes 

there are two kinds: blog posts and the list headers on a mobile

### my code

blog posts use a plain html `<details>` tag. the plus and minus are css:

```css
.post summary{cursor:pointer;list-style:none;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-weight:700}
.post summary::-webkit-details-marker{display:none}
.post summary::after{content:"+";font-family:"Archivo Black",sans-serif;font-size:18px}
.post[open] summary::after{content:"\2212"}
```

on a phone, the headers in work i've written and code + data open and close the same way. the first list starts open, the rest start closed:

```css
.pubs .vh::after{content:"+";font-family:"Archivo Black",sans-serif;font-size:22px;line-height:1;flex:none}
.pubs .vgrp:not(.shut) .vh::after{content:"\2013"}
.pubs .vgrp.shut .vlist,.pubs .vgrp.shut .vf{display:none}
```

```js
box.querySelectorAll(".vgrp").forEach(function(g,i){if(i>0)g.classList.add("shut")})
```

### template

```css
.post summary::after{content:"{{CLOSED_SYMBOL}}";font-family:"{{SYMBOL_FONT}}",sans-serif;font-size:{{SYMBOL_SIZE}}px}
.post[open] summary::after{content:"{{OPEN_SYMBOL}}"}
```

```js
box.querySelectorAll(".vgrp").forEach(function(g,i){if(i>{{HOW_MANY_START_OPEN_MINUS_ONE}})g.classList.add("shut")})
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{CLOSED_SYMBOL}}` | what shows while it's closed | `+` |
| `{{OPEN_SYMBOL}}` | what shows while it's open (a minus is `\2212`) | `\2212` |
| `{{SYMBOL_FONT}}` | font for the symbol | `Archivo Black` |
| `{{SYMBOL_SIZE}}` | size in pixels | `18` |
| `{{HOW_MANY_START_OPEN_MINUS_ONE}}` | 0 means only the first list starts open, 1 means two, and so on and so forth | `0` |

---

## 2.6 menu jump flash

tapping a menu link up top makes you scroll/jump smoothly to that section and gives it a quick red flash so people see where they landed.

### my code

```css
@keyframes flash-hit{0%{background-color:rgba(216,30,44,.16);box-shadow:0 0 0 6px rgba(216,30,44,.16)}100%{background-color:transparent;box-shadow:0 0 0 0 rgba(216,30,44,0)}}
section.flash{animation:flash-hit 1.2s ease-out}
```

```js
target.scrollIntoView({behavior:"smooth",block:"start"})
setTimeout(function(){target.classList.remove("flash")},1300)
```

### template

```css
@keyframes flash-hit{0%{background-color:rgba({{FLASH_COLOR_RGB}},.16);box-shadow:0 0 0 6px rgba({{FLASH_COLOR_RGB}},.16)}100%{background-color:transparent;box-shadow:0 0 0 0 rgba({{FLASH_COLOR_RGB}},0)}}
section.flash{animation:flash-hit {{FLASH_SECONDS}}s ease-out}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{FLASH_COLOR_RGB}}` | color as three numbers 0 to 255 with commas (appears 3 times) | `216,30,44` |
| `{{FLASH_SECONDS}}` | how long the flash lasts. keep the `1300` in the js a bit longer | `1.2` |

---

## 2.7 language cards

when you click the big name up top, the nav slides down while cards pop out one by one with text. if you tap a card and it flips to show a flag. click the name again and they go back.

### my code

css, the opening:

```css
.lang{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease}
body.lang-open .lang{grid-template-rows:1fr}
.lang-in{overflow:hidden;min-height:0}
.lcard{width:128px;perspective:700px;opacity:0;transform:translateY(-46px) scale(.3) rotate(-14deg);pointer-events:none;transition:transform .35s ease,opacity .2s ease}
body.lang-open .lcard{opacity:1;transform:none;pointer-events:auto;transition:transform .55s cubic-bezier(.34,1.56,.64,1) calc(var(--i,0)*90ms),opacity .25s ease calc(var(--i,0)*90ms)}
```

css, the flip:

```css
.lc-in{position:relative;width:100%;height:80px;transform-style:preserve-3d;transition:transform .65s cubic-bezier(.4,.2,.2,1)}
.lcard.flip .lc-in{transform:rotateY(180deg)}
.lc-f,.lc-k{position:absolute;inset:0;backface-visibility:hidden;border:3px solid var(--c);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--c)}
.lc-k{transform:rotateY(180deg)}
```

css, the animation when you click it:

```css
h1.jolt{animation:jolt .45s ease}
@keyframes jolt{0%{transform:scale(1) rotate(0)}30%{transform:scale(1.04) rotate(-1.5deg)}60%{transform:scale(.98) rotate(1deg)}100%{transform:scale(1) rotate(0)}}
```

js:

```js
var langToggle=function(){
  var o=!document.body.classList.contains("lang-open")
  document.body.classList.toggle("lang-open",o)
  nameH1.classList.add("jolt")
}
nameH1.addEventListener("click",langToggle)
card.classList.toggle("flip")
```

html for the name and the cards:

```html
<h1 id="name-h1" tabindex="0" role="button">love adu</h1>
<div class="name-hint" id="name-hint">psst... click my name</div>
<div class="lang" id="lang"><div class="lang-in"><div class="lcards" id="lcards">
  <div class="lcard" data-flag="uk" role="button" tabindex="0" style="--i:0">
    <div class="lc-in">
      <div class="lc-f"><div class="lc-g">hello</div></div>
      <div class="lc-k"><svg>…flag drawing…</svg></div>
    </div>
    <div class="lc-ed" contenteditable="false">
      <select class="lc-sel" contenteditable="false">…flag options…</select>
      <button class="v-btn lc-x edit-only" contenteditable="false">remove</button>
    </div>
  </div>
</div></div></div>
```

### template

```html
<h1 id="name-h1" tabindex="0" role="button">{{YOUR_NAME}}</h1>
<div class="name-hint" id="name-hint">{{HINT_TEXT}}</div>
<div class="lang" id="lang"><div class="lang-in"><div class="lcards" id="lcards">
  <div class="lcard" data-flag="{{FLAG_KEY}}" role="button" tabindex="0" style="--i:0">
    <div class="lc-in">
      <div class="lc-f"><div class="lc-g">{{GREETING}}</div></div>
      <div class="lc-k"></div>
    </div>
    <div class="lc-ed" contenteditable="false">
      <select class="lc-sel" contenteditable="false"></select>
      <button class="v-btn lc-x edit-only" contenteditable="false">remove</button>
    </div>
  </div>
</div></div></div>
```

```css
.lang{display:grid;grid-template-rows:0fr;transition:grid-template-rows {{OPEN_SECONDS}}s ease}
.lcard{width:{{CARD_WIDTH}}px}
.lc-in{height:{{CARD_HEIGHT}}px;transition:transform {{FLIP_SECONDS}}s cubic-bezier(.4,.2,.2,1)}
body.lang-open .lcard{transition:transform .55s cubic-bezier(.34,1.56,.64,1) calc(var(--i,0)*{{POP_DELAY_MS}}ms),opacity .25s ease calc(var(--i,0)*{{POP_DELAY_MS}}ms)}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{YOUR_NAME}}` | your name as the big title | `love adu` |
| `{{HINT_TEXT}}` | the little line under it. delete the whole div if you don't want it | `psst... click my name` |
| `{{FLAG_KEY}}` | which flag is on the back | `mexico` |
| `{{GREETING}}` | the word on the front | `hola` |
| `{{OPEN_SECONDS}}` | how fast the space opens under the name | `.45` |
| `{{CARD_WIDTH}}` / `{{CARD_HEIGHT}}` | card size in pixels | `128` / `80` |
| `{{FLIP_SECONDS}}` | how long a flip takes | `.65` |
| `{{POP_DELAY_MS}}` | milliseconds between each card popping out (appears twice) | `90` |

flag keys that exist: `uk`, `usa`, `mexico`, `japan`, `singapore`, `china`, `france`, `germany`, `italy`, `ireland`, `india`.

easiest way to build the cards is to keep my four from `index.html`, log in, and change the greetings and flags in the editor. the dropdown under each card picks the flag, **remove** deletes one, and **+ add language** makes a new one.

Also, I don't have all flags, so keep that in mind.

people with reduced motion turned on still get the cards, just with less movement. 

---

# part 3: aesthetics

## 3.1 colors, light and dark

### my code

```css
:root{--bg:#fff;--text:#0a0a0a;--dot:#d8d8d8;--ink:#0a0a0a;--ink-text:#fff;--muted:#444;--panel:#fafafa}
[data-theme="dark"]{--bg:#121314;--text:#f0f0f0;--dot:#2a2c2e;--ink:#f0f0f0;--ink-text:#121314;--muted:#aaa;--panel:#1c1e1f}
```

my two accent colors are red `#d81e2c` and blue `#1c3fd8`. they show up in the title shadow, button shadows, arrows, scrollbar, and the intro.

the link lines use a six color set, one for light and one for dark:

```css
.vi[data-c="1"] .lk{color:#1c5fd8}
.vi[data-c="2"] .lk{color:#d98a00}
.vi[data-c="3"] .lk{color:#d81e55}
.vi[data-c="4"] .lk{color:#8a3ac9}
.vi[data-c="5"] .lk{color:#1a8a4a}
.vi[data-c="6"] .lk{color:#f0509b}
[data-theme="dark"] .vi[data-c="1"] .lk{color:#6f9bff}
```

### template

```css
:root{--bg:{{LIGHT_BACKGROUND}};--text:{{LIGHT_TEXT}};--dot:{{LIGHT_DOTS}};--ink:{{LIGHT_BORDERS}};--ink-text:{{TEXT_ON_BORDER_COLOR}};--muted:{{LIGHT_GRAY_TEXT}};--panel:{{LIGHT_PANEL}}}
[data-theme="dark"]{--bg:{{DARK_BACKGROUND}};--text:{{DARK_TEXT}};--dot:{{DARK_DOTS}};--ink:{{DARK_BORDERS}};--ink-text:{{TEXT_ON_DARK_BORDER_COLOR}};--muted:{{DARK_GRAY_TEXT}};--panel:{{DARK_PANEL}}}
```

### what to replace

| blank | what it colors | my value (light / dark) |
|---|---|---|
| `{{LIGHT_BACKGROUND}}` / `{{DARK_BACKGROUND}}` | page background | `#fff` / `#121314` |
| `{{LIGHT_TEXT}}` / `{{DARK_TEXT}}` | main text | `#0a0a0a` / `#f0f0f0` |
| `{{LIGHT_DOTS}}` / `{{DARK_DOTS}}` | the dot pattern (3.2) | `#d8d8d8` / `#2a2c2e` |
| `{{LIGHT_BORDERS}}` / `{{DARK_BORDERS}}` | box borders and the black label chips | `#0a0a0a` / `#f0f0f0` |
| `{{TEXT_ON_BORDER_COLOR}}` / `{{TEXT_ON_DARK_BORDER_COLOR}}` | text sitting on those chips | `#fff` / `#121314` |
| `{{LIGHT_GRAY_TEXT}}` / `{{DARK_GRAY_TEXT}}` | small gray text | `#444` / `#aaa` |
| `{{LIGHT_PANEL}}` / `{{DARK_PANEL}}` | light panel color | `#fafafa` / `#1c1e1f` |

to change the two accents, use find and replace on `index.html`:

| find | replace with |
|---|---|
| `#d81e2c` | `{{YOUR_FIRST_ACCENT}}` |
| `#1c3fd8` | `{{YOUR_SECOND_ACCENT}}` |

for the six link colors, keep the light ones dark enough to read on white and the dark ones bright enough to read on your dark background. if you want to do similar colors to mine, keep in mind that orange and pink are the hardest to read on white, so go darker with those.

---

## 3.2 background dots

this makes it look like paper. my fav part tbh

### my code

```css
body{margin:0;background-color:var(--bg);background-image:radial-gradient(var(--dot) 1.1px,transparent 1.1px);background-size:24px 24px}
```

### template

```css
body{background-color:var(--bg);background-image:radial-gradient(var(--dot) {{DOT_SIZE}}px,transparent {{DOT_SIZE}}px);background-size:{{SPACING}}px {{SPACING}}px}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{DOT_SIZE}}` | dot radius in pixels (appears twice, keep them equal) | `1.1` |
| `{{SPACING}}` | distance between dots in pixels (appears twice) | `24` |

the dot color is `--dot` from 3.1. 
for no dots, delete the `background-image` and `background-size` parts.

---

## 3.3 cursors

### my code

| where | cursor |
|---|---|
| the big name `h1` | `pointer` (changes to `text` while editing) |
| light/dark button, lock button | `pointer` |
| `.lk[data-href]` (list titles that have a link) | `pointer` |
| `.lcard` (language cards) | `pointer` |
| `.post summary` (blog post titles) | `pointer` |
| `.pubs .vh` (list headers on a phone) | `pointer` |
| every edit button (`.v-btn`, `.del-btn`, bottom bar) | `pointer` |
| anything editable while logged in | `text` |

```css
h1{cursor:pointer}
body.editing h1{cursor:text}
.lk[data-href]{cursor:pointer}
.lcard{cursor:pointer}
body.editing [contenteditable="true"]{cursor:text}
```

### template

```css
{{WHAT_TO_CHANGE}}{cursor:{{CURSOR_STYLE}}}
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{WHAT_TO_CHANGE}}` | the css name of the thing | `.lcard` |
| `{{CURSOR_STYLE}}` | any built-in cursor name: `pointer`, `text`, `grab`, `help`, `crosshair`, `not-allowed`, `zoom-in` | `grab` |

for a custom image cursor, upload a small png (32 by 32 works) and use:

```css
body{cursor:url({{CURSOR_IMAGE_FILE}}) 0 0,auto}
```

| blank | what to put | example |
|---|---|---|
| `{{CURSOR_IMAGE_FILE}}` | file name of the image in the repo | `cursor.png` |

---

## 3.4 boxes

### my code

the label chip (slanted black trapezoid) for section heading:

```css
h2{font-family:"Archivo Black",sans-serif;font-weight:400;font-size:20px;display:inline-block;margin:50px 0 20px;background:var(--ink);color:var(--ink-text);padding:8px 16px;transform:skew(-3deg)}
h2 span{display:inline-block;transform:skew(3deg)}
```

the buttons with the red and blue offset shadow:

```css
.btn{display:inline-block;background:var(--ink);color:var(--ink-text);font-weight:700;text-decoration:none;padding:10px 18px;box-shadow:5px 5px 0 #d81e2c,10px 10px 0 #1c3fd8}
.btn:hover{transform:translate(-2px,-2px)}
```

the updates box and blog posts:

```css
.cal{list-style:none;margin:0 0 24px;padding:0;border:3px solid var(--ink)}
.cal li{display:flex;gap:16px;padding:12px 16px;border-bottom:3px solid var(--ink)}
.post{border:3px solid var(--ink);margin-bottom:16px;background:var(--panel)}
```

the scrolling work box, with grey bands:

```css
.pubs{border:3px solid var(--ink);border-radius:0;background:var(--bg)}
.pubs .vi:nth-child(odd){background:#f3f3f3}
.pubs .vi:nth-child(even){background:#e3e3e3}
```

### template

```css
h2{background:var(--ink);color:var(--ink-text);padding:{{CHIP_PADDING}};transform:skew({{CHIP_TILT}}deg)}
h2 span{transform:skew({{CHIP_TILT_BACK}}deg)}
.btn{box-shadow:{{SHADOW_1_OFFSET}}px {{SHADOW_1_OFFSET}}px 0 {{SHADOW_1_COLOR}},{{SHADOW_2_OFFSET}}px {{SHADOW_2_OFFSET}}px 0 {{SHADOW_2_COLOR}}}
.pubs{border:{{BORDER_THICKNESS}}px solid var(--ink);border-radius:{{CORNER_ROUNDNESS}}px}
.pubs .vi:nth-child(odd){background:{{LIGHT_BAND_COLOR}}}
.pubs .vi:nth-child(even){background:{{DARK_BAND_COLOR}}}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{CHIP_PADDING}}` | space inside the label chip | `8px 16px` |
| `{{CHIP_TILT}}` | how much the chip tilts: negative leans left, 0 is straight | `-3` |
| `{{CHIP_TILT_BACK}}` | the opposite number so the text stays straight | `3` |
| `{{SHADOW_1_OFFSET}}` / `{{SHADOW_2_OFFSET}}` | how far each shadow sticks out (in pixels) | `5` / `10` |
| `{{SHADOW_1_COLOR}}` / `{{SHADOW_2_COLOR}}` | the two shadow colors | `#d81e2c` / `#1c3fd8` |
| `{{BORDER_THICKNESS}}` | border width in pixels | `3` |
| `{{CORNER_ROUNDNESS}}` | 0 is square, 12 is soft | `0` |
| `{{LIGHT_BAND_COLOR}}` / `{{DARK_BAND_COLOR}}` | the two alternating row colors in the work box. **the dark theme has its own pair** under `[data-theme="dark"] .pubs .vi` | `#f3f3f3` / `#e3e3e3` |

---

## 3.5 fonts

### my code

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600&family=Archivo+Black&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
body{font-family:"Space Grotesk",Helvetica,Arial,sans-serif;font-size:17px;line-height:1.7}
h1{font-family:"Archivo","Archivo Black",sans-serif;font-weight:600}
h2{font-family:"Archivo Black",sans-serif}
.splash b{font-family:"Press Start 2P","Archivo Black",sans-serif}
```

| font | where it's used |
|---|---|
| Space Grotesk | body text, buttons, the heart animation |
| Archivo (weight 600) | the big title with name |
| Archivo Black | section labels, date chips, the plus and minus |
| Press Start 2P | the intro screen ani |

### template

```html
<link href="https://fonts.googleapis.com/css2?family={{FONT_1_NAME_WITH_PLUSES}}&family={{FONT_2_NAME_WITH_PLUSES}}&display=swap" rel="stylesheet">
```

```css
body{font-family:"{{BODY_FONT}}",Helvetica,Arial,sans-serif;font-size:{{BODY_SIZE}}px;line-height:{{LINE_HEIGHT}}}
h1{font-family:"{{TITLE_FONT}}",sans-serif;font-weight:{{TITLE_WEIGHT}}}
h2{font-family:"{{LABEL_FONT}}",sans-serif}
```

### what to replace

| blank | what to put | example |
|---|---|---|
| `{{FONT_1_NAME_WITH_PLUSES}}` | font name from fonts.google.com, spaces written as plus signs, with a weight if it needs one | `Space+Grotesk:wght@400;700` |
| `{{FONT_2_NAME_WITH_PLUSES}}` | a second font. if wanted, add more `&family=...` for more | `Archivo+Black` |
| `{{BODY_FONT}}` | the font for regular text (exact name and add spaces) | `Space Grotesk` |
| `{{BODY_SIZE}}` | text size in pixels | `17` |
| `{{LINE_HEIGHT}}` | space between lines. | `1.7` |
| `{{TITLE_FONT}}` | the font for big name | `Archivo` |
| `{{TITLE_WEIGHT}}` | 400 is regular, 700 bold, 900 heaviest | `600` |
| `{{LABEL_FONT}}` | the font on section labels | `Archivo Black` |

**every font you use needs to be in the `<link>` line first, or it won't save the rest.**

---

## 3.6 the dashed frame

the research interests section has a dashed border, which I liked and felt contributed to the paperlike aesthetic.

### my code

```css
#interests{padding:32px 26px 12px;background:
repeating-linear-gradient(90deg,var(--ink) 0 16px,transparent 16px 28px) 0 0/100% 3px no-repeat,
repeating-linear-gradient(90deg,var(--ink) 0 16px,transparent 16px 28px) 0 100%/100% 3px no-repeat,
repeating-linear-gradient(180deg,var(--ink) 0 16px,transparent 16px 28px) 0 0/3px 100% no-repeat,
repeating-linear-gradient(180deg,var(--ink) 0 16px,transparent 16px 28px) 100% 0/3px 100% no-repeat}
```

the four lines are the top, bottom, left, and right sides. `0 16px` is the dash and `16px 28px` ends the gap, so each dash is 16px long with a 12px gap.

### template

```css
#{{SECTION_ID}}{padding:{{SPACE_INSIDE}};background:
repeating-linear-gradient(90deg,{{DASH_COLOR}} 0 {{DASH_LENGTH}}px,transparent {{DASH_LENGTH}}px {{DASH_PLUS_GAP}}px) 0 0/100% {{THICKNESS}}px no-repeat,
repeating-linear-gradient(90deg,{{DASH_COLOR}} 0 {{DASH_LENGTH}}px,transparent {{DASH_LENGTH}}px {{DASH_PLUS_GAP}}px) 0 100%/100% {{THICKNESS}}px no-repeat,
repeating-linear-gradient(180deg,{{DASH_COLOR}} 0 {{DASH_LENGTH}}px,transparent {{DASH_LENGTH}}px {{DASH_PLUS_GAP}}px) 0 0/{{THICKNESS}}px 100% no-repeat,
repeating-linear-gradient(180deg,{{DASH_COLOR}} 0 {{DASH_LENGTH}}px,transparent {{DASH_LENGTH}}px {{DASH_PLUS_GAP}}px) 100% 0/{{THICKNESS}}px 100% no-repeat}
```

### what to replace

| blank | what to put | my value |
|---|---|---|
| `{{SECTION_ID}}` | the id of the section you want framed | `interests` |
| `{{SPACE_INSIDE}}` | padding inside the frame (top, sides, bottom) | `32px 26px 12px` |
| `{{DASH_COLOR}}` | line color. `var(--ink)` follows light and dark mode | `var(--ink)` |
| `{{DASH_LENGTH}}` | how long each dash is | `16` |
| `{{DASH_PLUS_GAP}}` | dash length plus the gap. for a 12px gap and a 16px dash, use 28 | `28` |
| `{{THICKNESS}}` | line thickness in pixels (appears 4 times) | `3` |

---

# stuff that's only mine, delete it

before you publish, go through and remove or swap everything that's about me:

- the four language cards and their greetings (2.7)
- the words in the changing sentence (2.4)
- the intro word and the heart ani word (2.1, 2.2)
- every line in updates (1.9)
- all the research interests and methods (1.6)
- all the papers, posters and op-eds (1.7)
- the beyoncePal line in code + data (1.8)
- the beyoncePal blog post and its photos if not editing (1.10)
- my email and linkedin (1.11)
- `Love_Adu_CV.pdf` and `favicon.png` (1.1)
- the `CNAME` file (1.1)
- the save function address (1.3)
  
# if something goes wrong

- **save failed**: log out and back in and check the password. if it keeps happening, the save function is down (cooked) or the token ran out
- **change isn't showing**: wait two minutes, then refresh or open a private window
- **something broke after an upload**: on github open `index.html`, click history, and restore an earlier version
- **a list or box is missing**: lists and boxes with no lines are hidden from visitors. log in and add a line with text, then save
- **page looks weird while editing**: discard changes :D
- **a font isn't showing**: make sure it's in the `<link>` line at the top (3.5) and spelled exactly like it is on fonts.google.com
- **the intro never goes away**: the leave time in 2.2 is shorter than the pixel erase in 2.3. just make the leave time bigger
- **you're so cool and sexy and goated for spending 2 friday nights doing this for me, I'm unbelievably grateful and depressed I can't thank you in person**: don't worry about it :)
