import questionService from '../services/questionService';
import examService from '../services/examService'

let listQuestionOfExam = {};
let ROOMS = {};
module.exports = (io, socket) => {
    // Function
    function calculatingScore(diffculty, timeRemaining){
        if(diffculty == 'Easy')
            return 10 * timeRemaining;
        else if (diffculty == 'Medium')
            return 20 * timeRemaining;
        else if (diffculty == 'Hard')
            return 30 * timeRemaining;
    }

    function timeExam(diffculty, timeRemaining){
        if(diffculty == 'Easy')
            return 30 - timeRemaining;
        else if (diffculty == 'Medium')
            return 45 - timeRemaining;
        else if (diffculty == 'Hard')
            return 60 - timeRemaining;
    }

    // Event
    socket.on('quiz:start', async ({room, userId, userName}) => {
        if (!listQuestionOfExam[room]){
            const currentExam = await examService.findExambyID(room);
            listQuestionOfExam[room] = await questionService.filterQuestionByExam(currentExam);
        }
        
        if(!ROOMS[room]){
            ROOMS[room] = {
                players: {}
            }
        }    
        
        ROOMS[room].players[socket.id] = {userId, userName, numberCorrect: 0, score: 0, timeDoExam: 0, currentQuestion: 0 }; // Người chơi bắt đầu từ câu hỏi đầu tiên
        let questionNumber = ROOMS[room].players[socket.id].currentQuestion; 
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }))
        let difficulty = listQuestionOfExam[room][questionNumber].difficulty;
        socket.emit('currentQuestion',  {questionNumber, question_text, difficulty, result});
    })

    socket.on('quiz:nextQuestion', ({room, userId, userName, difficultyQuestion, correct, timeRemaining})=>{
        // Xử lý khi đã trả lời câu hỏi
        ROOMS[room].players[socket.id].currentQuestion++;
        if(correct == true){
            ROOMS[room].players[socket.id].score += calculatingScore(difficultyQuestion, timeRemaining);
            ROOMS[room].players[socket.id].numberCorrect ++;
        }
        
        ROOMS[room].players[socket.id].timeDoExam += timeExam(difficultyQuestion, timeRemaining);
        // Player đã trả lời hết câu hỏi
        if(ROOMS[room].players[socket.id].currentQuestion >= listQuestionOfExam[room].length){
            socket.emit("finishQuiz", 
                {numberCorrect:  ROOMS[room].players[socket.id].numberCorrect,
                score:  ROOMS[room].players[socket.id].score,
                timeDoExam:  ROOMS[room].players[socket.id].timeDoExam
                }
            );    
            return;
        }
        let questionNumber = ROOMS[room].players[socket.id].currentQuestion; 
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }))
        let difficulty = listQuestionOfExam[room][questionNumber].difficulty;
        
        socket.emit('currentQuestion',  {questionNumber, question_text, difficulty, result});
    })

    socket.on('quiz:redirect', ({room}) => {
        io.to(room).emit('redirectToQuiz');
    });
}