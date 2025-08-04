"use strict";(()=>{console.log("DiscoDigger running...");var E=new Set(["abt","bc","yeah","dont","think","also","get","got","after","going","theres","ill","yes","thats","i","im","i'm","r","ur","u","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","to","from","up","down","in","out","on","off","then","here","there","when","where","why","how","all","any","both","each","should","now","few","more","most","other","some","such","no","not","only","own","same","so","than","too","very","can","will","just","his","himself","she"]),c=new Map,d=new Map,b=new Map([[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],[21,0],[22,0],[23,0]]),y;function S(r){let i=(BigInt(r)>>22n)+1420070400000n;return new Date(Number(i))}var M=document.createElement("iframe");M.style.display="none";var L=document.body.appendChild(M).contentWindow.localStorage,h=L.token;h=h.slice(1,h.length-1);console.log("token obtained: ",h);var a=document.createElement("img"),k=chrome.runtime.getURL("imgs/shovel.png"),z=chrome.runtime.getURL("imgs/shovelActive.png");a.id="discoDigButton";a.src=k;a.width=25;a.height=25;a.onclick=j;a.style.cursor="pointer";var p=document.createElement("span");p.id="discoDigModal";var x=chrome.runtime.getURL("imgs/bulldozer.gif");p.innerHTML=`
<style>
.modebar{
    display: none !important;
}

::-webkit-scrollbar-thumb {
  background-color: #F1FFE7;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;  
}

::-webkit-scrollbar {
  width: 16px;
}

#closeButton {
    float:right;
    border-radius: 100%;
    background-color: red;
    color: white;
    height: 30px;
    width: 30px;
}

#DDContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#DDDiv {
    background-color: rgba(54, 42, 191, 0.9);
    width: 80vw;
    height: 70vh;
    position: absolute;
    z-index: 1000;
    padding: 15px;
    border: 3px solid #ffffff;
    border-radius: 15px;
    overflow-y: scroll;
}

#title {
    text-align: center;
    color: white;
    font-size: 40px;
    font-weight: strong;
    margin-bottom: 20px;
}

#dataScreen {
  display: none;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

#loadingScreen {
    display: none
}

#userCounts, #userWordCounts, #wordCloud {
    margin: 5px;
    background-color: rgb(74, 61, 214);
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
}

#userCounts {
    width: 35%;
}

#userWordCounts {
    width: 22.5%;
}

#wordCloud {
    width: 35%;
}

#dayGraph, #timeGraph {
    width: 45%;
}

#wordCloudCanvas {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

#selectedChannel {
    color: white;
    text-align: center;
}

#bulldozer {
    position: relative;
    overflow: hidden;
    height: 100px; /* Adjust to your gif height */
    width: 100%;
}

#bulldozer img {
    position: absolute;
    animation: moveBuldozer 10s linear infinite;
    height: 100%;
}


#userTopWords {
    text-align: center;
    color: white;
    font-size: 27px;
}

#userSelect   {
    width: 200px;
    margin: 0 auto;
    display: block;
     background-color:rgb(60, 194, 132);
      color: white;
      padding: 10px;
      font-size: 16px;
      border: none;
}

@keyframes moveBuldozer {
    0% {
        left: -200px;
        transform: scaleX(-1);
    }

    50% {
        left: 100%;
        transform: scaleX(-1);
    }
    51% {
        transform: scaleX(1);
    }

    99% {
        transform: scaleX(1);
    }
    100% {
        left: -200px;
        transform: scaleX(-1);
    }
}

#loadingContainer {
    height: 24px;
    width: 80%;
    border: 1px grey solid;
    background-color: rgba(0, 0, 0, 0);
}

#loadingBar {
    height: 24px;
    width: 0%;
    background-color: red;
}

#credits {
    color: white;
}
</style>


<div id="DDContainer">
  <div id="DDDiv">
    <h2 id="title">DiscoDig</h2>
    <h3 id="selectedChannel"></h3>

    <div id="splashScreen">
        <input type="number" id="nInput"> how many msgs? </input>
        <br>
        <button id="digBtn"> dig! </button>
    </div>

    <div id="loadingScreen">
        <div id="bulldozer">
            <img src="${x}" />
        </div>
        <p id="progress"></p>
        <div id="loadingContainer">
            <div id="loadingBar"></div>
        </div>
    </div>

    <div id="dataScreen">
        <div id="userCounts"></div>

        <div id="userWordCounts">
            <select id="userSelect" class="clickable"></select>
            <br>
            <ol id="userTopWords"></ol>
        </div>

        <div id="wordCloud">
            <canvas id="wordCloudCanvas">
            </canvas>
        </div>

        <div id="dayGraph">
        </div>

        <div id="timeGraph">
        </div>

        <div id="bulldozer">
            <img src="${x}" />
        </div>

        <p id="credits">made by <a href="https://vidsterbroyo.com/">vidu widyalankara</a> & <a href="https://www.linkedin.com/in/kai-bar-on/">kai bar-on</a></p>
    </div>

    <br>


  </div>
</div>`;p.style.display="none";document.body.appendChild(p);document.getElementById("digBtn").onclick=N;var T=document.getElementById("splashScreen"),W=document.getElementById("nInput"),C=document.getElementById("loadingScreen"),H=document.getElementById("progress"),A=document.getElementById("loadingContainer"),$=document.getElementById("loadingBar"),B=document.getElementById("dataScreen"),w=document.getElementById("userSelect");w.onchange=I;var v=document.getElementById("userTopWords"),P=document.getElementById("selectedChannel"),u=document.getElementById("wordCloudCanvas"),q=document.getElementById("dayGraph"),_=document.getElementById("timeGraph"),F=new MutationObserver(r=>{if(window.location.href.includes("@me")&&window.location.href.length>32)for(let t of r)for(let i of t.addedNodes)i.querySelector?.(".toolbar__9293f")&&(console.log("new DM opened"),G())});F.observe(document.body,{childList:!0,subtree:!0});function G(){console.log("button spawning..."),document.getElementsByClassName("toolbar__9293f")[0].appendChild(a)}async function j(){if(console.log("DD opened!"),p.style.display=="block"){p.style.display="none",a.src=k;return}if(p.style.display="block",a.src=z,BigInt(window.location.href.slice(33))==y)return;y=BigInt(window.location.href.slice(33)),B.style.display="none",T.style.display="block";let t=await(await fetch(`https://discord.com/api/v9/channels/${y}`,{method:"GET",headers:{"Content-Type":"application/json",authorization:h}})).json();P.innerHTML=t.name||`DMs w/ ${t.recipients[0].username}`}var f;async function N(){T.style.display="none",C.style.display="block",c.clear(),d.clear(),w.innerHTML="",v.innerHTML="";let r,t=69,i=420;f=parseInt(W.value);let l=new Date;console.log("timestamp",l);for(let o=0;o<Math.ceil(f/100);o++){r=`https://discord.com/api/v9/channels/${y}/messages?${o!=0&&`before=${t}`}&limit=100`;try{let e=await fetch(r,{method:"GET",headers:{"Content-Type":"application/json",authorization:h}});if(!e.ok){let s=await e.json();throw e.status==429?(console.log("yikes getting rate limited"),console.log(s),console.log(s.retry_after)):(console.log("some non-429 api error"),console.log(s)),new Error("beep boop error")}let n=await e.json();n.forEach(s=>{c.set(s.author.username,[...c.get(s.author.username)||[],s.content]);let g=S(s.id);if(console.log("latest msg",g),(+l-+g)/(1e3*3600*24)>1){console.log("gap to be filled");let m=new Date(l);for(m.setDate(m.getDate()-1);m>g;)d.set(m.toLocaleDateString(),0),m.setDate(m.getDate()-1)}console.log(d),l=g;let D=l.toLocaleDateString();i=l.getHours(),d.set(D,(d.get(D)||0)+1),b.set(i,(b.get(i)||0)+1)}),console.log(d),t=n[n.length-1].id,H.innerHTML=`${(o+1)*100} / ${f} messages loaded`,$.style.width=`${(o+1)*100/f*100}%`}catch(e){console.error(e)}}console.log(c),C.style.display="none",B.style.display="flex",R(),X(),I(),U()}function U(){let r={x:[...d.keys()].reverse(),y:[...d.values()].reverse(),type:"scatter",line:{color:"rgb(255, 255, 255)",width:1}},t={x:["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"],y:[...b.values()],type:"scatter",line:{color:"rgb(255, 255, 255)",width:1}};Plotly.newPlot(q,[r],{title:{text:"Number of Messages Per Day"},paper_bgcolor:"rgba(0, 0, 0, 0)",plot_bgcolor:"rgba(0, 0, 0, 0)",font:{color:"white"},margin:{r:40,l:40},xaxis:{showgrid:!1},yaxis:{showgrid:!1,showline:!0}}),Plotly.newPlot(_,[t],{title:{text:"Total Number of Messages Per Time of Day"},paper_bgcolor:"rgba(0, 0, 0, 0)",plot_bgcolor:"rgba(0, 0, 0, 0)",font:{color:"white"},margin:{r:40,l:40},xaxis:{showgrid:!1},yaxis:{showgrid:!1,showline:!0}})}function X(){let r=[];c.forEach(e=>{r=r.concat(e.join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,"").toLowerCase().split(" ").filter(n=>n&&!E.has(n)))});let t=new Map;r.forEach(e=>{t.set(e,t.get(e)+1||1)}),console.log(t);let i=[];t.forEach((e,n)=>{i.push([n,e])}),console.log(t),console.log(i),u.width=u.offsetWidth,u.height=u.offsetHeight;let l=Math.max(...i.map(([e,n])=>n)),o=.4;WordCloud(u,{list:i,gridSize:2,shape:"circle",color:"random-light",backgroundColor:"rgb(74, 61, 214)",drawOutOfBound:!0,ellipticity:1,weightFactor:e=>10+Math.pow(e/l,o)*50,hover:e=>console.log(e)})}function R(){let r=[],t=[];c.forEach((e,n)=>{e.length/f<.001?t.push(n):r.push(e.length),w.innerHTML+=` <option value="${n}">${n}</option>`});var i=[{type:"pie",values:r,labels:[...c.keys()].filter(e=>!t.includes(e)),textinfo:"label+percent",insidetextorientation:"radial",automargin:!0}],l={paper_bgcolor:"rgba(0, 0, 0, 0)",margin:{t:0,b:0,l:0,r:0},showlegend:!1,font:{color:"white"}};let o=document.getElementById("userCounts");Plotly.newPlot(o,i,l,{responsive:!0})}function I(){v.innerHTML="";let r=w.value,t=c.get(r).join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,"").toLowerCase().split(" ").filter(o=>o&&!E.has(o)),i=new Map;t.forEach(o=>{i.set(o,i.get(o)+1||1)});let l=[{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0},{word:"",freq:0}];i.forEach((o,e)=>{let n=9;for(;o>l[n].freq&&(n--,!(n<0)););n<9&&(l.splice(n+1,0,{word:e,freq:o}),l.pop())}),l.forEach((o,e)=>{v.innerHTML+=` <li>${e+1}. ${o.word} (${o.freq})</li>`})}})();
