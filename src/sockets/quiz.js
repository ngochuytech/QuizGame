import questionService from '../services/questionService';
import examService from '../services/examService'

let listQuestionOfExam = {};
let ROOMS = {};
let questionTimers = {};

module.exports = (io, socket) => {
    // Function
    function calculatingScore(diffculty) {
        if (diffculty == 'Easy')
            return 10;
        else if (diffculty == 'Medium')
            return 20;
        else if (diffculty == 'Hard')
            return 30;
    }

    async function endQuiz(room) {
        // Kết thúc bài thi cho tất cả người chơi
        setTimeout(() => {
            Object.keys(ROOMS[room].players).forEach(playerId => {
                const playerData = ROOMS[room].players[playerId];
                io.to(playerId).emit("finishQuiz", {
                    numberCorrect: playerData.numberCorrect,
                    score: playerData.score
                });
            });
        }, 500)

        try {
            await examService.updateState(room, 'Closed');
        } catch (error) {
            console.log(error);
        }

    }

    function startQuestionTimer(room) {
        let timeLeft;
        const diffculty = listQuestionOfExam[room][ROOMS[room].currentQuestion].difficulty
        if(diffculty == 'Easy')
            timeLeft = '15';
        else if(diffculty == 'Normal')
            timeLeft = '20';
        else
            timeLeft = '25';
        // Kiểm tra nếu bộ đếm thời gian đã chạy thì không khởi động lại
        if (questionTimers[room]) return;
        ROOMS[room].questionInProgress = true;


        questionTimers[room] = setInterval(() => {
            timeLeft--;

            io.to(room).emit('updateTimer', { timeLeft });
            if (timeLeft <= 0) {
                clearInterval(questionTimers[room]);
                delete questionTimers[room]; // Xóa bộ đếm sau khi dừng
                if (ROOMS[room].questionInProgress) {
                    ROOMS[room].questionInProgress = false; // Đặt lại cờ
                    io.to(room).emit('submitAnswer');
                    ROOMS[room].currentQuestion++;
                    setTimeout(() => {
                        if (ROOMS[room].currentQuestion < listQuestionOfExam[room].length) {
                            sendNextQuestion(room);
                        } else {
                            endQuiz(room);
                        }
                    }, 1500)

                }
            }
        }, 1000);
    }

    function sendNextQuestion(room) {
        let questionNumber = ROOMS[room].currentQuestion;
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }));
        let difficulty = listQuestionOfExam[room][questionNumber].difficulty;
        startQuestionTimer(room);
        io.to(room).emit('currentQuestion', { questionNumber, question_text, difficulty, result });

    }

    // Event
    socket.on('quiz:start', async ({ room, userId, userName }) => {

        if (!listQuestionOfExam[room]) {
            const currentExam = await examService.findExambyID(room);
            listQuestionOfExam[room] = await questionService.filterQuestionByExam(currentExam);
        }

        if (!ROOMS[room]) {
            ROOMS[room] = {
                players: {},
                currentQuestion: 0,
                questionInProgress: true
            }
        }

        try {
            const stateOfExam = await examService.checkStateExam(room);
            if(stateOfExam == "Closed"){
                socket.emit("redirect:leaderboard");
                return;
            }
        } catch (error) {
            console.log(error);
        }
        socket.join(room);
        ROOMS[room].players[socket.id] = { userName, numberCorrect: 0, score: 0, timeDoExam: 0 }; // Người chơi bắt đầu từ câu hỏi đầu tiên
        let questionNumber = ROOMS[room].currentQuestion;
        let question_text = listQuestionOfExam[room][questionNumber].question;
        let result = listQuestionOfExam[room][questionNumber].answer.map(item => ({
            text: item.text,
            isCorrect: item.isCorrect
        }))
        let difficulty = listQuestionOfExam[room][questionNumber].difficulty;
        startQuestionTimer(room);
        socket.emit('currentQuestion', { questionNumber, question_text, difficulty, result });
    })

    socket.on('quiz:handleAnswer', ({ room, userId, difficultyQuestion, correct }) => {

        // Xử lý trường hợp trả lời đúng !
        if (correct == true) {
            ROOMS[room].players[socket.id].score += calculatingScore(difficultyQuestion);
            ROOMS[room].players[socket.id].numberCorrect++;
        }

    })

    socket.on('disconnect', () => {

        for (const room in ROOMS) {
            if (ROOMS[room].players[socket.id]) {
                delete ROOMS[room].players[socket.id];
                if (Object.keys(ROOMS[room].players).length === 0) {
                    // delete ROOMS[room];
                    // delete listQuestionOfExam[room];
                    // delete questionTimers[room];
                }
                break;
            }
        }
    });


    socket.on('quiz:redirect', ({ room }) => {
        io.to(room).emit('redirectToQuiz');
    });


}