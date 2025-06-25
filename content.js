console.log("DiscoDig running...")

// initialize variables
const stopwords = new Set([
    "also", "get", "got", "after", "going", "theres", "ill", "yes", "thats", "i",
    "im", "i'm", "r", "ur", "u", "me", "my", "myself", "we", "our", "ours",
    "ourselves", "you", "your",
    "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
    "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
    "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
    "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
    "at", "by", "for", "with", "about", "to", "from", "up", "down",
    "in", "out", "on", "off", "then", "here", "there", "when", "where",
    "why", "how", "all", "any", "both", "each", "should", "now",
    "few", "more", "most", "other", "some", "such", "no", "not", "only",
    "own", "same", "so", "than", "too", "very", "can", "will", "just"
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


// get user token (remove before pushing to github)
const iframe = document.createElement("iframe")
iframe.style.display = "none"
const storage = document.body.appendChild(iframe).contentWindow.localStorage;
token = storage.token
token = token.slice(1, token.length - 1)
console.log("token obtained: ", token)


// create DD button
const DDbutton = document.createElement("img");
const shovelImg = chrome.runtime.getURL('imgs/shovel.png');
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
    padding: 20px;
    border: 3px solid #ffffff;
    border-radius: 25px;
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
    margin: 10px;
    background-color: rgb(74, 61, 214);
    width: 30%;
    height: 400px;
    border-radius: 10px;
}

#dayGraph, #timeGraph {
    width: 45%;
}

#wordCloudCanvas {
    width: 100%;
    height: 100%;
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
</style>


<div id="DDContainer">
  <div id="DDDiv">
    <button id="closeButton" class="clickable">X</button>
    <h2 id="title">DiscoDig</h2>
    <h3 id="selectedChannel"></h3>

    <div id="splashScreen">
        <input type="number" id="nInput"> how many msgs? </input>
        <button id="digBtn"> dig! </button>
    </div>

    <div id="loadingScreen">
        <div id="bulldozer">
            <img src="${bulldozerGif}" />
        </div>
            <p id="progress"></p>
    </div>

    <div id="dataScreen">
        <div id="userCounts"></div>

        <div id="userWordCounts">
            <select id="userSelect"></select>
            <ol id="userTopWords"></ol>
        </div>

        <div id="wordCloud">
            <canvas id="wordCloudCanvas" width="400" height="400">
            </canvas>
        </div>
        
        <div id="dayGraph">
        </div>

        <div id="timeGraph">
        </div>

        <div id="bulldozer">
            <img src="${bulldozerGif}" />
        </div>
    </div>

    <br>
    

  </div>
</div>`
    ;


discoDig.style.display = "none"
document.body.appendChild(discoDig);
document.getElementById("closeButton").onclick = closeDD
document.getElementById("digBtn").onclick = dig
document.getElementById("userSelect").onchange = fetchCommonWords


// DDModal handles
const splashScreen = document.getElementById("splashScreen")
const nInput = document.getElementById("nInput")
const loadingScreen = document.getElementById("loadingScreen")
const progressStatus = document.getElementById("progress")
const dataScreen = document.getElementById("dataScreen")
const userSelect = document.getElementById("userSelect")
const userTopWordsDisplay = document.getElementById("userTopWords")
const selectedChannelDisplay = document.getElementById("selectedChannel")
const wordCloudCanvas = document.getElementById("wordCloudCanvas")
const dayGraphDisplay = document.getElementById("dayGraph")
const timeGraphDisplay = document.getElementById("timeGraph")




// event listener for discord toolbar appearing
const observer = new MutationObserver((mutationsList) => {
    if (window.location.href.includes("@me") && window.location.href.length > 32) { // check if current page is a DM/GC
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.querySelector?.(".toolbar__9293f")) { // search for toolbar 
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


// open modal
async function openDD() {
    console.log("DD opened!");
    discoDig.style.display = "block";

    // if still on same DM, do nothing
    if (window.location.href.slice(33) == chatID) {
        return
    }

    chatID = window.location.href.slice(33);

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

    channel = await response.json()
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
    let link;

    n = nInput.value;

    for (let i = 0; i < Math.ceil(n / 100); i++) {

        link = `https://discord.com/api/v9/channels/${chatID}/messages?${(i != 0) && `before=${lastID}`}&limit=100`

        let response = await fetch(link, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });


        msgs = await response.json()

        msgs.forEach((msg) => {
            // map the senders of the msgs
            mappedMessages.set(
                msg.author.username,
                [...(mappedMessages.get(msg.author.username) || []), msg.content]
            );

            // map the dates & times of the msgs
            let timestamp = snowflakeToDate(msg.id)
            let date = timestamp.toLocaleDateString()
            let time = timestamp.getHours()

            datedMessages.set(date, (datedMessages.get(date) + 1 || 1));
            timedMessages.set(time, timedMessages.get(time) + 1);
        })

        console.log(datedMessages)

        lastID = msgs[msgs.length - 1].id

        console.log((i + 1) * 100 + " loaded")
        progressStatus.innerHTML = `${(i + 1) * 100} / ${n} messages loaded`
    }

    console.log(mappedMessages)
    loadingScreen.style.display = "none"
    dataScreen.style.display = "flex"


    calculateUserCounts()
    fetchWordCloud()
    fetchCommonWords()
    displayDayTimeGraph()
}



// display time graph
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
    let allWords = []

    mappedMessages.forEach((user) => {
        allWords = allWords.concat(user.join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word)));
    })



    // map them all
    let mappedWords = new Map();
    allWords.forEach((word) => {
        mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
    })



    console.log(mappedWords)

    let wordCloudList = []
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



function calculateUserCounts() {
    // calculate user counts + populate userSelect
    let userCounts = []
    mappedMessages.forEach((msgs, user) => {
        userCounts.push(msgs.length)
        userSelect.innerHTML += ` <option value="${user}">${user}</option>`
    });


    // display user counts
    var data = [{
        type: "pie",
        values: userCounts,
        labels: [...mappedMessages.keys()], // .keys() returns an iterable - ... spreads it
        textinfo: "label+percent",
        textposition: "outside",
        automargin: true
    }]

    var layout = {
        height: 400,
        width: 400,
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
        showlegend: false,
        font: {
            color: 'white'
        }
    }

    const userCountDisplay = document.getElementById('userCounts');
    Plotly.newPlot(userCountDisplay, data, layout)
}


function fetchCommonWords() {
    userTopWordsDisplay.innerHTML = ""

    // get array of words used by the user
    let selectedUser = userSelect.value
    userWords = mappedMessages.get(selectedUser).join(" ").replace(/[!"’#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').toLowerCase().split(" ").filter(word => word && !stopwords.has(word));

    // map them all
    let mappedWords = new Map();
    userWords.forEach((word) => {
        mappedWords.set(word, (mappedWords.get(word) + 1 || 1));
    })


    // rank words
    let topWords = Array(10).fill().map(() => ({ word: "", freq: 0 })); // .fill() fills array with undefined

    mappedWords.forEach((freq, word) => {

        // find where the word fits into the topWords
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


    // display rankings
    topWords.forEach((wordObject, index) => {
        userTopWordsDisplay.innerHTML += ` <li>${index + 1}. ${wordObject.word} (${wordObject.freq})</li>`
    })
}



function closeDD() {
    discoDig.style.display = "none"
    console.log("DD closed")
}