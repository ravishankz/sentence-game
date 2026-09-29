const questions = [

[
"The playful dog",
"is",
"running",
"across",
"the wooden bridge"
],

[
"The curious cat",
"is",
"sitting",
"inside",
"the tree house"
],

[
"The little squirrel",
"is",
"climbing",
"up",
"the tree"
],

[
"The white rabbit",
"is",
"sitting",
"on",
"the rocks",
"beside",
"the waterfall"
],

[
"The white duck",
"is",
"swimming",
"under",
"the bridge"
],

[
"The turtle",
"is",
"floating",
"on",
"the lake",
"near",
"the grassy bank"
],

[
"The little bear",
"is",
"hiding",
"inside",
"the yellow tent"
],

[
"The colourful butterfly",
"is",
"resting",
"on",
"the tree stump"
],

[
"The green frog",
"is",
"sitting",
"on",
"a",
"lily pad",
"in",
"the small pond"
],

[
"The cat",
"is",
"looking",
"out of",
"the tree house",
"towards",
"the mountains"
]

];



let currentQuestion = 0;

let score = 0;

let draggedWord = null;

let movingWords = [];

let questionCompleted = false;

let completedQuestions = [];




const startScreen =
document.getElementById("startScreen");

const gameScreen =
document.getElementById("gameScreen");

const resultScreen =
document.getElementById("resultScreen");


const bank =
document.getElementById("wordBank");

const answerBox =
document.getElementById("answerBox");


const feedback =
document.getElementById("feedback");


const scoreText =
document.getElementById("score");


const questionNumber =
document.getElementById("questionNumber");


const progressBar =
document.getElementById("progressBar");


const checkBtn =
document.getElementById("checkBtn");

const nextBtn =
document.getElementById("nextBtn");

const finishBtn =
document.getElementById("finishBtn");


const navigatorBox =
document.getElementById("questionNavigator");






document
.getElementById("startBtn")
.onclick = startGame;


checkBtn.onclick = checkAnswer;


document
.getElementById("resetBtn")
.onclick = resetQuestion;


document
.getElementById("nextBtn")
.onclick = nextQuestion;


document
.getElementById("restartBtn")
.onclick = restartGame;

finishBtn.onclick = finishGame;








function shuffle(array){

    return [...array]
    .sort(()=>Math.random()-0.5);

}








function startGame(){


    startScreen.classList.remove("active");


    gameScreen.classList.add("active");


    createQuestionNavigator();


    updateProgressBar();


    loadQuestion();


}








function createQuestionNavigator(){


    navigatorBox.innerHTML="";



    questions.forEach((question,index)=>{


        const btn =
        document.createElement("button");



        btn.className="question-btn";


        btn.textContent=index+1;



        btn.onclick=function(){


            currentQuestion=index;


            loadQuestion();


        };



        navigatorBox.appendChild(btn);


    });



}








function updateNavigator(){


    const buttons =
    document.querySelectorAll(".question-btn");



    buttons.forEach((button,index)=>{


        button.classList.remove(
            "active",
            "completed"
        );



        if(index===currentQuestion){

            button.classList.add("active");

        }



        if(
        completedQuestions.includes(index)
        ){

            button.classList.add("completed");

        }



    });


}








function updateProgressBar(){


    const completedCount =
    completedQuestions.length;



    const percentage =
    (completedCount / questions.length) * 100;



    progressBar.style.width =
    percentage + "%";


}








function loadQuestion(){


    questionCompleted = false;


    checkBtn.disabled = false;



    bank.innerHTML = "";


    answerBox.innerHTML = "";


    feedback.textContent = "";



    questionNumber.textContent =
    currentQuestion + 1;

    updateNextButton();



    updateNavigator();


    updateProgressBar();



    movingWords = [];



    const words =
    shuffle(
        questions[currentQuestion]
    );



    setTimeout(()=>{


        words.forEach(word=>{


            const card =
            document.createElement("div");


            card.className="word";


            card.textContent = word;


            card.draggable = true;



            bank.appendChild(card);




            let x =
            Math.max(
                0,
                Math.random() *
                (bank.clientWidth -
                card.offsetWidth)
            );



            let y =
            Math.max(
                0,
                Math.random() *
                (bank.clientHeight -
                card.offsetHeight)
            );



            card.style.left =
            x + "px";


            card.style.top =
            y + "px";





            const object = {


                element: card,


                x:x,


                y:y,


                dx:
                (Math.random()*0.4+0.1)
                *
                (Math.random()<0.5?-1:1),



                dy:
                (Math.random()*0.4+0.1)
                *
                (Math.random()<0.5?-1:1),



                active:true


            };



            movingWords.push(object);





            card.addEventListener(
            "dragstart",
            ()=>{


                draggedWord = card;


                card.classList.add(
                    "dragging"
                );


            });



            card.addEventListener(
            "dragend",
            ()=>{


                card.classList.remove(
                    "dragging"
                );


            });



        });



    },100);



}








function animate(){


    movingWords.forEach(word=>{


        if(!word.active)
        return;



        word.x += word.dx;


        word.y += word.dy;



        const w =
        word.element.offsetWidth;


        const h =
        word.element.offsetHeight;



        if(
        word.x <= 0 ||
        word.x+w >= bank.clientWidth
        ){

            word.dx *= -1;

        }



        if(
        word.y <= 0 ||
        word.y+h >= bank.clientHeight
        ){

            word.dy *= -1;

        }



        word.element.style.left =
        word.x + "px";


        word.element.style.top =
        word.y + "px";



    });



    requestAnimationFrame(animate);


}


animate();

// Drag and Drop


bank.addEventListener(
"dragover",
e=>e.preventDefault()
);


answerBox.addEventListener(
"dragover",
e=>e.preventDefault()
);




answerBox.addEventListener(
"drop",
e=>{


    e.preventDefault();



    if(!draggedWord)
    return;



    answerBox.appendChild(
        draggedWord
    );



    const obj =
    movingWords.find(
        x=>x.element===draggedWord
    );



    obj.active = false;



    draggedWord.style.position =
    "relative";


    draggedWord.style.left =
    "auto";


    draggedWord.style.top =
    "auto";


});







bank.addEventListener(
"drop",
e=>{


    e.preventDefault();



    if(!draggedWord)
    return;



    bank.appendChild(
        draggedWord
    );



    const obj =
    movingWords.find(
        x=>x.element===draggedWord
    );



    obj.active = true;



    obj.x = 50;

    obj.y = 50;



    draggedWord.style.position =
    "absolute";


});









// Check Answer


function checkAnswer(){


    if(questionCompleted){

        return;

    }




    const studentSentence =
    [...answerBox.children]
    .map(
        word=>word.textContent
    );



    const correctSentence =
    questions[currentQuestion];




    if(
    JSON.stringify(studentSentence)
    ===
    JSON.stringify(correctSentence)

    ){



        questionCompleted = true;



        // Add score only once

        if(
        !completedQuestions.includes(currentQuestion)
        ){


            completedQuestions.push(
                currentQuestion
            );


            score++;


            scoreText.textContent =
            score;


        }





        updateNavigator();


        updateProgressBar();



        feedback.textContent = getCorrectMessage();


        feedback.style.color =
        "green";



        checkBtn.disabled = true;



        answerBox.classList.add(
            "correct"
        );



        setTimeout(()=>{


            answerBox.classList.remove(
                "correct"
            );


        },600);



    }

    else{


        feedback.textContent =
        "❌ Try Again!";


        feedback.style.color =
        "red";



        answerBox.classList.add(
            "wrong"
        );



        setTimeout(()=>{


            answerBox.classList.remove(
                "wrong"
            );


        },500);



    }


}









// Reset Current Question


function resetQuestion(){


    loadQuestion();


}









// Next Question


function nextQuestion(){



    if(
    currentQuestion <
    questions.length-1

    ){


        currentQuestion++;


        loadQuestion();



    }

    else{


        finishGame();


    }



}









// Finish Game


function finishGame(){


    gameScreen.classList.remove(
        "active"
    );


    resultScreen.classList.add(
        "active"
    );



    document
    .getElementById("finalScore")
    .textContent =
    score;



    let resultMessage;


if(score === questions.length){

    resultMessage =
    "🏆 Amazing! You arranged every sentence correctly!";

}
else if(score >= 8){

    resultMessage =
    "🌟 Excellent work! You are very close to a perfect score!";

}
else if(score >= 5){

    resultMessage =
    "😊 Nice effort! You are improving step by step!";

}
else if(score > 0){

    resultMessage =
    "🌱 Good try! Keep practicing and you will improve!";

}
else{

    resultMessage =
    "💪 Don't give up! Try again and learn from each sentence!";

}


document
.querySelector("#resultScreen h1")
.textContent = resultMessage;



    document
    .querySelector("#resultScreen p")
    .textContent =
    `You completed ${completedQuestions.length} out of ${questions.length} sentences.`;

}









// Restart Game


function restartGame(){


    currentQuestion = 0;


    score = 0;


    completedQuestions = [];



    scoreText.textContent = 0;



    updateProgressBar();



    resultScreen.classList.remove(
        "active"
    );


    gameScreen.classList.add(
        "active"
    );



    createQuestionNavigator();



    loadQuestion();



}

function getCorrectMessage(){


    const completed =
    completedQuestions.length;



    if(completed === questions.length){

        return "🏆 Excellent! All sentences completed!";

    }


    if(completed === 1){

        return "✅ Correct! Great start.";

    }


    if(completed === 5){

        return "🔥 Halfway completed! Keep going.";

    }


    const messages = [

        "✅ Correct!",

        "⭐ Nice work!",

        "👏 Well done!",

        "✨ Excellent!",

        "🚀 Keep it up!"

    ];



    return messages[
        Math.floor(
            Math.random() * messages.length
        )
    ];

}

function updateNextButton(){


    if(currentQuestion === questions.length - 1){

        nextBtn.disabled = true;

        nextBtn.textContent = "Last Question";

    }
    else{

        nextBtn.disabled = false;

        nextBtn.textContent = "Next";

    }


}