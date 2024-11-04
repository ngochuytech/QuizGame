let leaderboard = {};

module.exports = (io, socket) => {
    // Function
    function updatePlayer(room, userId, numberComplete, numberCorrect, score){
        const user = leaderboard[room].find(player => player.userId === userId);
        user.numberComplete = numberComplete
        user.numberCorrect = numberCorrect
        user.score = score;
        return user.userName
    }
    // Event
    socket.on("leaderboard:start", ({room, userId, userName, avatar, numberComplete, numberCorrect, score}) => {
        if(!leaderboard[room])
            leaderboard[room] = []
        if (!leaderboard[room].some(user => user.userId === userId))
            leaderboard[room].push({userId, userName, avatar, numberComplete, numberCorrect, score})
        io.to(room).emit('displayLeaderboard', leaderboard[room]);
    })

    socket.on("leaderboard:update", ({room, userId, numberComplete, numberCorrect, score})=>{
        const userName = updatePlayer(room, userId, numberComplete, numberCorrect, score)
        io.to(room).emit('updateLeaderboard', ({userName, numberComplete, numberCorrect, score }))
    })

    socket.on("leaderboard:display", ({room})=>{
        socket.join(room);
        io.to(room).emit('displayLeaderboard', leaderboard[room]);
    })

    socket.on("leaderboard:endQuiz", ({room}) =>{
        if(leaderboard[room])
            delete leaderboard[room];
    })
}