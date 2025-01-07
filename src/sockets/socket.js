import quiz from './quiz'
import leaderboard from './leaderboard';

let rooms = {};  // Để lưu trữ danh sách người dùng theo từng phòng
let onlineUsers =  new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('userOnline', ({userId, username}) =>{
            if(!onlineUsers.has(userId)) {
                onlineUsers.set(userId, {socketId: socket.id, username});
            }
        })        

        // Khi người dùng tham gia phòng
        socket.on('joinRoom', ({idUser,  username, room }) => { 
            if (!rooms[room]) {
                rooms[room] = []; 
            }
            const userExists = rooms[room].some(user => user.idUser === idUser); // Kiểm tra user đó đã có trong phòng đó chưa ?
            if(!userExists)
            {
                socket.join(room);  
                rooms[room].push({ id: socket.id, idUser, username });
                io.to(room).emit('updateUserList', rooms[room]);  
            }
            else {
                // Nếu user đã tồn tại (dựa trên idUser), gửi thông báo hoặc xử lý logic
 
                socket.emit('error', 'Bạn đã có mặt trong phòng từ một tab khác.');
            }
            
        });

        quiz(io, socket);
        leaderboard(io, socket);

        // Khi người dùng rời khỏi phòng hoặc mất kết nối
        socket.on('disconnect', () => {
            onlineUsers.forEach((value, key) => {
                if(value.socketId === socket.id){
                    onlineUsers.delete(key)
                }
            })
            
            for (const room in rooms) {
                rooms[room] = rooms[room].filter(user => user.id !== socket.id);
                io.to(room).emit('updateUserList', rooms[room]);  // Cập nhật danh sách người dùng trong phòng
                if (rooms[room].length==0) // Xoá những room mà không còn người dùng ở trong room đó
                    delete rooms[room];
            }

        });
    });
    module.exports.onlineUsers = onlineUsers;
};
