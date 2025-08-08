// these lines only import the TYPES for these libraries
// this way, the .js file won't re-import the libraries 
// which will break the code since it's running in chrome, not node

import type PlotlyType from 'plotly.js';
declare const Plotly: typeof PlotlyType;

import type WordCloudType from 'wordcloud';
declare const WordCloud: typeof WordCloudType;



console.log("DiscoDig running...")


// initialize variables
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

// array of messages, array of most used words, avg msg count, 

interface userData {
    allMessages: string[],
    mostUsedWords: { word: string, freq: number }[],
    avgMsgLength: number,
    numberOfMessages: number,
    avgReplyTime: number[]
}


let mappedMessages: Map<string, userData> = new Map();  // user: their data
let datedMessages = new Map();                          // date: number of msgs
let timedMessages: Map<number, number> = new Map([      // time: number of msgs
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
    [10, 0], [11, 0], [12, 0], [13, 0], [14, 0],
    [15, 0], [16, 0], [17, 0], [18, 0], [19, 0],
    [20, 0], [21, 0], [22, 0], [23, 0]
]);
let gifFrequency: Map<string, number> = new Map();      // gif link: # of times used

let chatID: BigInt;
let n: number;


// get date of msgs
function snowflakeToDate(snowflake: number): Date {
    const discordEpoch = 1420070400000n;
    const timestamp = (BigInt(snowflake) >> 22n) + discordEpoch;
    return new Date(Number(timestamp));
}


// get user token (remove before pushing to github)
const iframe: HTMLIFrameElement = document.createElement("iframe")
iframe.style.display = "none"
const storage = document.body.appendChild(iframe).contentWindow!.localStorage;
let token = storage.token
token = token.slice(1, token.length - 1)
console.log("token obtained: ", token)


// create shovel button
const DDbutton = document.createElement("img");
const shovelImg = chrome.runtime.getURL('imgs/shovel.png');
const activeShovelImg = chrome.runtime.getURL('imgs/shovelActive.png');
DDbutton.id = "discoDigButton";
DDbutton.src = shovelImg
DDbutton.width = 25;
DDbutton.height = 25;
DDbutton.onclick = openDD
DDbutton.style.cursor = "pointer"


// create DD modal
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
    width: 45%;
}

#userWordCounts {
    width: 50%;
}

#wordCloud {
    width: 45%;
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


#userTopWords, #userAvgLength, #userAvgReplyTime {
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

        <div id="wordCloud">
            <canvas id="wordCloudCanvas">
            </canvas>
        </div>

        <div id="userWordCounts">
            <select id="userSelect" class="clickable"></select>
            <br>
            <ol id="userTopWords"></ol>
            <p id="userAvgLength"></p>
            <p id="userAvgReplyTime"></p>
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
</div>`
    ;


discoDig.style.display = "none"
document.body.appendChild(discoDig);
document.getElementById("digBtn")!.onclick = dig


// DDModal handles
const splashScreen = document.getElementById("splashScreen")!
const nInput: HTMLInputElement = document.getElementById("nInput")! as HTMLInputElement
const loadingScreen = document.getElementById("loadingScreen")!
const progressStatus = document.getElementById("progress")!
const loadingContainer = document.getElementById("loadingContainer")!
const loadingBar = document.getElementById("loadingBar")!
const dataScreen = document.getElementById("dataScreen")!
const userSelect: HTMLInputElement = document.getElementById("userSelect")! as HTMLInputElement
userSelect.onchange = displayCommonWords
const userTopWordsDisplay = document.getElementById("userTopWords")!
const userAvgLengthDisplay = document.getElementById("userAvgLength")!
const userAvgReplyTimeDisplay = document.getElementById("userAvgReplyTime")!
const selectedChannelDisplay = document.getElementById("selectedChannel")!
const wordCloudCanvas: HTMLCanvasElement = document.getElementById("wordCloudCanvas")! as HTMLCanvasElement
const dayGraphDisplay = document.getElementById("dayGraph")!
const timeGraphDisplay = document.getElementById("timeGraph")!



// event listener for discord toolbar appearing
const observer = new MutationObserver((mutationsList) => {
    if (window.location.href.includes("@me") && window.location.href.length > 32) { // check if current page is a DM/GC
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if ((node as HTMLElement).querySelector?.(".toolbar__9293f")) { // search for toolbar 
                    console.log("new DM opened");
                    spawnButton()
                }
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});


// spawn button in toolbar
function spawnButton() {
    console.log("button spawning...")

    const toolbar = document.getElementsByClassName("toolbar__9293f")[0];
    toolbar.appendChild(DDbutton);
}


// on shovel press
async function openDD() {
    console.log("DD opened!");

    if (discoDig.style.display == "block") {
        discoDig.style.display = "none"
        DDbutton.src = shovelImg
        return
    }

    discoDig.style.display = "block";
    DDbutton.src = activeShovelImg

    // if still on same DM, do nothing
    if (BigInt(window.location.href.slice(33)) == chatID) {
        return
    }

    chatID = BigInt(window.location.href.slice(33));

    dataScreen.style.display = "none";
    splashScreen.style.display = "block"


    // fetch + display name of channel
    let response = await fetch(`https://discord.com/api/v9/channels/${chatID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    });

    let channel: { name: string; recipients: { username: string }[] } = await response.json()
    selectedChannelDisplay.innerHTML = channel.name || `DMs w/ ${channel.recipients[0].username}`
}



// main digging function
async function dig() {
    splashScreen.style.display = "none"
    loadingScreen.style.display = "block"

    mappedMessages.clear()
    datedMessages.clear()

    userSelect.innerHTML = ""
    userTopWordsDisplay.innerHTML = ""
    let link: string;

    let lastID: number = 69;
    let time: number = 420; // just to appease the typescript gods


    n = parseInt(nInput.value);

    let timestamp = new Date()
    console.log("timestamp", timestamp)

    for (let i = 0; i < Math.ceil(n / 100); i++) {

        link = `https://discord.com/api/v9/channels/${chatID}/messages?${(i != 0) && `before=${lastID}`}&limit=100`

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
                    console.log("yikes getting rate limited")
                    console.log(error)
                    console.log(error.retry_after)
                }
                else {
                    console.log("some non-429 api error")
                    console.log(error)
                }

                throw new Error("beep boop error");
            }

            let msgs: {
                id: number,
                author: {
                    username: string
                },
                content: string
            }[] = await response.json();


            msgs.forEach((msg, i) => {

                // if user hasn't been added yet, initialize them
                if (!mappedMessages.has(msg.author.username)) {
                    mappedMessages.set(msg.author.username, {
                        allMessages: [],
                        mostUsedWords: [{ word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }, { word: "", freq: 0 }],
                        avgMsgLength: 0,
                        numberOfMessages: 0,
                        avgReplyTime: [0, 0]
                    }
                    )
                    userSelect.innerHTML += ` <option value="${msg.author.username}">${msg.author.username}</option>`
                }


                // update user's data
                let userData = mappedMessages.get(msg.author.username)!;
                userData.allMessages.push(msg.content)
                userData.numberOfMessages += 1;
                userData.avgMsgLength = userData.avgMsgLength * (1 - (1 / userData.numberOfMessages)) + msg.content.split(" ").length * (1 / userData.numberOfMessages)
                
                // if msg is a gif, add the gif to frequency list
                if (msg.content.indexOf('https://tenor.com/view') != -1){
                    gifFrequency.set(msg.content, (gifFrequency.get(msg.content)! + 1 || 1))
                }

                // get time of the msg
                let newTimestamp: Date = snowflakeToDate(msg.id)

                // get time between msgs
                let minutes: number = (+timestamp - +newTimestamp) / (1000 * 60);

                // check if there is a missing date (time between consecutive msgs > 1 day)
                // ("+" to convert date to milliseconds)
                if ((minutes / (60 * 24)) > 1) {
                    console.log("gap to be filled")

                    // if so, fill in the dates
                    let addedDate = new Date(timestamp);
                    addedDate.setDate(addedDate.getDate() - 1);

                    while (addedDate > newTimestamp) {
                        datedMessages.set(addedDate.toLocaleDateString(), 0)
                        addedDate.setDate(addedDate.getDate() - 1);
                    }

                    // else (since the delay isn't > 1 day), add the reply time to the last user's avgReplyTime
                    // but first check that you're not on the first msg AND that the 2 msgs are on the same day - disregard msgs that are on 2 different days. it's likely not a reply to the conversation. even if it is, it's only like 1 msg we are ommitting from the data
                } else if (i != 0 && timestamp.getDate() == newTimestamp.getDate()) {

                    // check that they're not just replying to themself
                    if (msgs[i - 1].author.username != msg.author.username) {
                        
                        let lastUserData = mappedMessages.get(msgs[i - 1].author.username)!
                        lastUserData.avgReplyTime[1] += 1 // update number of valid "avgReplyTime" msgs
 
                        lastUserData.avgReplyTime[0] = lastUserData.avgReplyTime[0] * (1 - 1 / lastUserData.avgReplyTime[1]) + minutes * (1 / lastUserData.avgReplyTime[1])

                        // console.log(`${msgs[i - 1].author.username} replied to ${msg.author.username}: ${msgs[i - 1].content}`)
                        // console.log(`updated reply time for ${msgs[i - 1].author.username}: `, lastUserData.avgReplyTime)
                        // console.log(minutes)
                    }
                }


                timestamp = newTimestamp
                let date = timestamp.toLocaleDateString()
                time = timestamp.getHours()

                datedMessages.set(date, (datedMessages.get(date) || 0) + 1);
                timedMessages.set(time, (timedMessages.get(time) || 0) + 1);
            })


            lastID = msgs[msgs.length - 1].id

            progressStatus.innerHTML = `${(i + 1) * 100} / ${n} messages loaded`
            loadingBar.style.width = `${((i + 1) * 100 / n) * 100}%`

        } catch (error) {
            console.error(error);
        }


    }


    console.log(gifFrequency)
    loadingScreen.style.display = "none"
    dataScreen.style.display = "flex"


    calculatePieChart()
    fetchWordCloud()
    displayDayTimeGraph()
    fetchCommonWords()
    displayCommonWords()
}



// display time graph
function displayDayTimeGraph() {
    let dayData: Plotly.Data = {
        x: [...datedMessages.keys()].reverse(),
        y: [...datedMessages.values()].reverse(),
        type: 'scatter',
        line: {
            color: 'rgb(255, 255, 255)',
            width: 1
        }
    };

    let timeData: Plotly.Data = {
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


    Plotly.newPlot(dayGraphDisplay, [dayData],
        {
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


    Plotly.newPlot(timeGraphDisplay, [timeData],
        {
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
    // get a list of ALL words 
    // map them
    // convert it to a list
    let allWords: string[] = []

    mappedMessages.forEach((user: userData) => {
        allWords = allWords.concat(user.allMessages.join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word)));
    })



    // map them all
    let mappedWords = new Map();
    allWords.forEach((word) => {
        mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
    })



    let wordCloudList: [string, number][] = []
    mappedWords.forEach((freq, word) => {
        wordCloudList.push([word, freq])
    })

    console.log(mappedWords)
    console.log(wordCloudList)



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
        // shrinkToFit: true,
        hover: (item) => console.log(item)
    });
}



function calculatePieChart() {
    // calculate user counts + populate userSelect
    let userCounts: number[] = []
    let omitFromPie: string[] = [] // list of users to omit from pie (used when not enough texts sent)

    mappedMessages.forEach((userData, user) => {
        if (userData.numberOfMessages / n < 0.001) {
            omitFromPie.push(user)
        } else {
            userCounts.push(userData.numberOfMessages)
        }
    });


    // display user counts
    var data: Plotly.Data[] = [{
        type: "pie",
        values: userCounts,
        labels: [...mappedMessages.keys()].filter((user) => !omitFromPie.includes(user)), // .keys() returns an iterable - ... spreads it
        textinfo: "label+percent",
        insidetextorientation: "radial",
        automargin: true
    }]

    var layout = {
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
        showlegend: false,
        font: {
            color: 'white'
        }
    }

    const userCountDisplay: HTMLElement = document.getElementById('userCounts')!;
    Plotly.newPlot(userCountDisplay, data, layout, { responsive: true })
}


function fetchCommonWords() {

    // go through each user's userData
    mappedMessages.forEach((userData) => {

        // generate an array of words used by the user
        let userWords: string[] = userData.allMessages.join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word));

        // frequency map them all (word: frequency)
        let mappedWords = new Map();
        userWords.forEach((word) => {
            mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
        })

        // get handle for user's mostUsedWords list
        let topWords = userData.mostUsedWords

        // go through each word to determine top 10 list
        mappedWords.forEach((freq, word) => {

            // find where the word fits into user's the topWords
            let i = 9
            while (freq > topWords[i].freq) {
                i--;
                if (i < 0) {
                    break
                }
            }

            // check if while loop ran,
            // then insert the word
            if (i < 9) {
                topWords.splice(i + 1, 0, { word: word, freq: freq })
                topWords.pop()
            }
        });
    });
}


function displayCommonWords() {
    userTopWordsDisplay.innerHTML = ""

    let selectedUserData: userData = mappedMessages.get(userSelect.value)!
    let topWords = selectedUserData.mostUsedWords

    // display rankings
    topWords.forEach((wordObject, index) => {
        userTopWordsDisplay.innerHTML += ` <li>${index + 1}. ${wordObject.word} (${wordObject.freq})</li>`
    })

    userAvgLengthDisplay.innerHTML = `Average message length: ${Math.round(selectedUserData.avgMsgLength * 100) / 100} words`
    userAvgReplyTimeDisplay.innerHTML = `Average reply time ${Math.round(selectedUserData.avgReplyTime[0] * 100) / 100} mins`
}
