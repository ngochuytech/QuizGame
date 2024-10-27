import questionService from '../services/questionService';
import examService from '../services/examService'
let listQuestionOfExam = {};
let ROOMS = {};
module.exports = (io, socket) => {
    // Function

    // Event
    socket.on('quiz:start', async ({room, userId, username}) => {
        if (!listQuestionOfExam[room]){
            const currentExam = await examService.findExambyID(room);
            listQuestionOfExam[room] = await questionService.filterQuestionByExam(currentExam);
        }
        if(!ROOMS[room]){
            ROOMS[room] = {
                players: {}
            }
        }    
        
        ROOMS[room].players[socket.id] = {userId, username, score: 0, currentQuestion: 0 }; // Người chơi bắt đầu từ câu hỏi đầu tiên
        let questionNumber = ROOMS[room].players[socket.id].currentQuestion; 
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }))
        socket.emit('currentQuestion',  {questionNumber, question_text, result});
    })

    socket.on('quiz:nextQuestion', ({room, userId, userName, correct})=>{
        // Xử lý khi đã trả lời câu hỏi
        ROOMS[room].players[socket.id].currentQuestion++;
        if(correct == true)
            ROOMS[room].players[socket.id].score += 10;
            
        // Player đã trả lời hết câu hỏi
        if(ROOMS[room].players[socket.id].currentQuestion >= listQuestionOfExam[room].length){
            socket.emit("finishQuiz", {});
            return;
        }
        let questionNumber = ROOMS[room].players[socket.id].currentQuestion; 
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }))
        socket.emit('currentQuestion',  {questionNumber, question_text, result});
    })

    socket.on('quiz:redirect', ({room}) => {
        io.to(room).emit('redirectToQuiz');
    });
}