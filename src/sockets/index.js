let rooms = {};  // Để lưu trữ danh sách người dùng theo từng phòng

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        console.log("Current room = ", rooms);
        
        // Khi người dùng tham gia phòng
        socket.on('joinRoom', ({ username, room }) => {
            socket.join(room);  // Thêm socket vào phòng cụ thể
            if (!rooms[room]) {
                rooms[room] = [];  // Tạo danh sách người dùng nếu phòng chưa tồn tại
            }
            rooms[room].push({ id: socket.id, username });
            io.to(room).emit('updateUserList', rooms[room]);  // Phát danh sách người dùng cho phòng cụ thể
            console.log(`${username} đã tham gia phòng ${room}`);
            console.log("After room when joinRoom = ", rooms);
        });

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
