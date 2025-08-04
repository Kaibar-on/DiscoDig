"use strict";
Plotly: typeof import('plotly.js');
WordCloud: typeof import('wordcloud');
console.log("DiscoDig running...");
const stopwords = new Set([
    "abt", "bc", "yeah", "dont", "think", "also", "get", "got",
    "after", "going", "theres", "ill", "yes", "thats", "i",
    "im", "i'm", "r", "ur", "u", "me", "my", "myself", "we", "our", "ours",
    "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him",
    "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
    "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
    "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
    "at", "by", "for", "with", "about", "to", "from", "up", "down",
    "in", "out", "on", "off", "then", "here", "there", "when", "where",
    "why", "how", "all", "any", "both", "each", "should", "now",
    "few", "more", "most", "other", "some", "such", "no", "not", "only",
    "own", "same", "so", "than", "too", "very", "can", "will", "just",
    "his", "himself", "she",
]);
let mappedMessages = new Map();
let datedMessages = new Map();
let timedMessages = new Map([
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
    [10, 0], [11, 0], [12, 0], [13, 0], [14, 0],
    [15, 0], [16, 0], [17, 0], [18, 0], [19, 0],
    [20, 0], [21, 0], [22, 0], [23, 0]
]);
let chatID;
function snowflakeToDate(snowflake) {
    const discordEpoch = 1420070400000n;
    const timestamp = (BigInt(snowflake) >> 22n) + discordEpoch;
    return new Date(Number(timestamp));
}
const iframe = document.createElement("iframe");
iframe.style.display = "none";
const storage = document.body.appendChild(iframe).contentWindow.localStorage;
let token = storage.token;
token = token.slice(1, token.length - 1);
console.log("token obtained: ", token);
const DDbutton = document.createElement("img");
const shovelImg = chrome.runtime.getURL('imgs/shovel.png');
const activeShovelImg = chrome.runtime.getURL('imgs/shovelActive.png');
DDbutton.id = "discoDigButton";
DDbutton.src = shovelImg;
DDbutton.width = 25;
DDbutton.height = 25;
DDbutton.onclick = openDD;
DDbutton.style.cursor = "pointer";
const discoDig = document.createElement("span");
discoDig.id = "discoDigModal";
const bulldozerGif = chrome.runtime.getURL('imgs/bulldozer.gif');
discoDig.innerHTML = `
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
            <img src="${bulldozerGif}" />
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
            <img src="${bulldozerGif}" />
        </div>

        <p id="credits">made by <a href="https://vidsterbroyo.com/">vidu widyalankara</a> & <a href="https://www.linkedin.com/in/kai-bar-on/">kai bar-on</a></p>
    </div>

    <br>


  </div>
</div>`;
discoDig.style.display = "none";
document.body.appendChild(discoDig);
document.getElementById("digBtn").onclick = dig;
const splashScreen = document.getElementById("splashScreen");
const nInput = document.getElementById("nInput");
const loadingScreen = document.getElementById("loadingScreen");
const progressStatus = document.getElementById("progress");
const loadingContainer = document.getElementById("loadingContainer");
const loadingBar = document.getElementById("loadingBar");
const dataScreen = document.getElementById("dataScreen");
const userSelect = document.getElementById("userSelect");
userSelect.onchange = fetchCommonWords;
const userTopWordsDisplay = document.getElementById("userTopWords");
const selectedChannelDisplay = document.getElementById("selectedChannel");
const wordCloudCanvas = document.getElementById("wordCloudCanvas");
const dayGraphDisplay = document.getElementById("dayGraph");
const timeGraphDisplay = document.getElementById("timeGraph");
const observer = new MutationObserver((mutationsList) => {
    if (window.location.href.includes("@me") && window.location.href.length > 32) {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.querySelector?.(".toolbar__9293f")) {
                    console.log("new DM opened");
                    spawnButton();
                }
            }
        }
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
function spawnButton() {
    console.log("button spawning...");
    const toolbar = document.getElementsByClassName("toolbar__9293f")[0];
    toolbar.appendChild(DDbutton);
}
async function openDD() {
    console.log("DD opened!");
    if (discoDig.style.display == "block") {
        discoDig.style.display = "none";
        DDbutton.src = shovelImg;
        return;
    }
    discoDig.style.display = "block";
    DDbutton.src = activeShovelImg;
    if (BigInt(window.location.href.slice(33)) == chatID) {
        return;
    }
    chatID = BigInt(window.location.href.slice(33));
    dataScreen.style.display = "none";
    splashScreen.style.display = "block";
    let response = await fetch(`https://discord.com/api/v9/channels/${chatID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    });
    let channel = await response.json();
    selectedChannelDisplay.innerHTML = channel.name || `DMs w/ ${channel.recipients[0].username}`;
}
let n;
async function dig() {
    splashScreen.style.display = "none";
    loadingScreen.style.display = "block";
    mappedMessages.clear();
    datedMessages.clear();
    userSelect.innerHTML = "";
    userTopWordsDisplay.innerHTML = "";
    let link;
    let lastID = 69;
    let time = 420;
    n = parseInt(nInput.value);
    let timestamp = new Date();
    console.log("timestamp", timestamp);
    for (let i = 0; i < Math.ceil(n / 100); i++) {
        link = `https://discord.com/api/v9/channels/${chatID}/messages?${(i != 0) && `before=${lastID}`}&limit=100`;
        try {
            const response = await fetch(link, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            });
            if (!response.ok) {
                let error = await response.json();
                if (response.status == 429) {
                    console.log("yikes getting rate limited");
                    console.log(error);
                    console.log(error.retry_after);
                }
                else {
                    console.log("some non-429 api error");
                    console.log(error);
                }
                throw new Error("beep boop error");
            }
            let msgs = await response.json();
            msgs.forEach((msg) => {
                mappedMessages.set(msg.author.username, [...(mappedMessages.get(msg.author.username) || []), msg.content]);
                let newTimestamp = snowflakeToDate(msg.id);
                console.log("latest msg", newTimestamp);
                if (((+timestamp - +newTimestamp) / (1000 * 3600 * 24)) > 1) {
                    console.log("gap to be filled");
                    let addedDate = new Date(timestamp);
                    addedDate.setDate(addedDate.getDate() - 1);
                    while (addedDate > newTimestamp) {
                        datedMessages.set(addedDate.toLocaleDateString(), 0);
                        addedDate.setDate(addedDate.getDate() - 1);
                    }
                }
                console.log(datedMessages);
                timestamp = newTimestamp;
                let date = timestamp.toLocaleDateString();
                time = timestamp.getHours();
                datedMessages.set(date, (datedMessages.get(date) || 0) + 1);
                timedMessages.set(time, (timedMessages.get(time) || 0) + 1);
            });
            console.log(datedMessages);
            lastID = msgs[msgs.length - 1].id;
            progressStatus.innerHTML = `${(i + 1) * 100} / ${n} messages loaded`;
            loadingBar.style.width = `${((i + 1) * 100 / n) * 100}%`;
        }
        catch (error) {
            console.error(error);
        }
    }
    console.log(mappedMessages);
    loadingScreen.style.display = "none";
    dataScreen.style.display = "flex";
    calculateUserCounts();
    fetchWordCloud();
    fetchCommonWords();
    displayDayTimeGraph();
}
function displayDayTimeGraph() {
    let dayData = {
        x: [...datedMessages.keys()].reverse(),
        y: [...datedMessages.values()].reverse(),
        type: 'scatter',
        line: {
            color: 'rgb(255, 255, 255)',
            width: 1
        }
    };
    let timeData = {
        x: [
            "12am", "1am", "2am", "3am", "4am", "5am",
            "6am", "7am", "8am", "9am", "10am", "11am",
            "12pm", "1pm", "2pm", "3pm", "4pm", "5pm",
            "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"
        ],
        y: [...timedMessages.values()],
        type: 'scatter',
        line: {
            color: 'rgb(255, 255, 255)',
            width: 1
        }
    };
    Plotly.newPlot(dayGraphDisplay, [dayData], {
        title: { text: "Number of Messages Per Day" },
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        font: { color: 'white' },
        margin: {
            r: 40,
            l: 40
        },
        xaxis: {
            showgrid: false
        },
        yaxis: {
            showgrid: false,
            showline: true
        }
    });
    Plotly.newPlot(timeGraphDisplay, [timeData], {
        title: { text: "Total Number of Messages Per Time of Day" },
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        font: { color: 'white' },
        margin: {
            r: 40,
            l: 40
        },
        xaxis: {
            showgrid: false
        },
        yaxis: {
            showgrid: false,
            showline: true
        }
    });
}
function fetchWordCloud() {
    let allWords = [];
    mappedMessages.forEach((user) => {
        allWords = allWords.concat(user.join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word)));
    });
    let mappedWords = new Map();
    allWords.forEach((word) => {
        mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
    });
    console.log(mappedWords);
    let wordCloudList = [];
    mappedWords.forEach((freq, word) => {
        wordCloudList.push([word, freq]);
    });
    console.log(mappedWords);
    console.log(wordCloudList);
    wordCloudCanvas.width = wordCloudCanvas.offsetWidth;
    wordCloudCanvas.height = wordCloudCanvas.offsetHeight;
    const maxFreq = Math.max(...wordCloudList.map(([_, freq]) => freq));
    const power = 0.4;
    WordCloud(wordCloudCanvas, {
        list: wordCloudList,
        gridSize: 2,
        shape: "circle",
        color: "random-light",
        backgroundColor: "rgb(74, 61, 214)",
        drawOutOfBound: true,
        ellipticity: 1,
        weightFactor: (freq) => {
            const minFontSize = 10;
            const maxFontSize = 60;
            const normalized = Math.pow(freq / maxFreq, power);
            return minFontSize + normalized * (maxFontSize - minFontSize);
        },
        hover: (item) => console.log(item)
    });
}
function calculateUserCounts() {
    let userCounts = [];
    let omitFromPie = [];
    mappedMessages.forEach((msgs, user) => {
        if (msgs.length / n < 0.001) {
            omitFromPie.push(user);
        }
        else {
            userCounts.push(msgs.length);
        }
        userSelect.innerHTML += ` <option value="${user}">${user}</option>`;
    });
    var data = [{
            type: "pie",
            values: userCounts,
            labels: [...mappedMessages.keys()].filter((user) => !omitFromPie.includes(user)),
            textinfo: "label+percent",
            insidetextorientation: "radial",
            automargin: true
        }];
    var layout = {
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
        showlegend: false,
        font: {
            color: 'white'
        }
    };
    const userCountDisplay = document.getElementById('userCounts');
    Plotly.newPlot(userCountDisplay, data, layout, { responsive: true });
}
function fetchCommonWords() {
    userTopWordsDisplay.innerHTML = "";
    let selectedUser = userSelect.value;
    let userWords = mappedMessages.get(selectedUser).join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word));
    let mappedWords = new Map();
    userWords.forEach((word) => {
        mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
    });
    let topWords = [{ word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }];
    mappedWords.forEach((freq, word) => {
        let i = 9;
        while (freq > topWords[i].freq) {
            i--;
            if (i < 0) {
                break;
            }
        }
        if (i < 9) {
            topWords.splice(i + 1, 0, { word: word, freq: freq });
            topWords.pop();
        }
    });
    topWords.forEach((wordObject, index) => {
        userTopWordsDisplay.innerHTML += ` <li>${index + 1}. ${wordObject.word} (${wordObject.freq})</li>`;
    });
}
function closeDD() {
    discoDig.style.display = "none";
    console.log("DD closed");
}
