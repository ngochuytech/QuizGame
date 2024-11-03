import quiz from './quiz'
import leaderboard from './leaderboard';

let rooms = {};  // Để lưu trữ danh sách người dùng theo từng phòng

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        console.log("Current room = ", rooms);
        
        // Khi người dùng tham gia phòng
        socket.on('joinRoom', ({idUser,  username, room }) => { 
            if (!rooms[room]) {
                rooms[room] = [];  // Tạo danh sách người dùng nếu phòng chưa tồn tại
            }
            const userExists = rooms[room].some(user => user.idUser === idUser); // Kiểm tra user đó đã có trong phòng đó chưa ?
            if(!userExists)
            {
                socket.join(room);  // Thêm socket vào phòng cụ thể
                rooms[room].push({ id: socket.id, idUser, username });
                io.to(room).emit('updateUserList', rooms[room]);  // Phát danh sách người dùng cho phòng cụ thể
                console.log(`${username} đã tham gia phòng ${room}`);
                console.log("After room when joinRoom = ", rooms);
            }
            else {
                // Nếu user đã tồn tại (dựa trên idUser), gửi thông báo hoặc xử lý logic
                console.log(`${username} (ID: ${idUser}) đã có mặt trong phòng ${room}, không thể tham gia lại.`);
                socket.emit('error', 'Bạn đã có mặt trong phòng từ một tab khác.');
            }
            
        });

        quiz(io, socket);
        leaderboard(io, socket);

        // Khi người dùng rời khỏi phòng hoặc mất kết nối
        socket.on('disconnect', () => {
            console.log('A user disconnect:', socket.id);
            for (const room in rooms) {
                rooms[room] = rooms[room].filter(user => user.id !== socket.id);
                io.to(room).emit('updateUserList', rooms[room]);  // Cập nhật danh sách người dùng trong phòng
                if (rooms[room].length==0) // Xoá những room mà không còn người dùng ở trong room đó
                    delete rooms[room];
                console.log(`User with ID ${socket.id} đã rời khỏi phòng ${room}`);
            }

            console.log("After room when disconnect = ", rooms);
        });
    });
};
