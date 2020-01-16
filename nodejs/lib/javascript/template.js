module.exports={
    HTML_Main:function(title = "ChatChat", member = "undefined", head = "Welcome to ChatChat!", body = ''){
        return `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                <link rel="stylesheet" href="/css/template.css">
            </head>
            <body>
                <script src="/socket.io/socket.io.js"></script>
                <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
                <script>
                var socket = io();
                </script>
                <h1 style="text-align:center; margin-top:20px; margin-bottom:15px;"><a href="/" style="text-decoration:none;">${head}</a></h1>
                <div class="header">
                    <div id="login" class="pull-right" style="text-align:right; margin-bottom:15px; margin-right:60px">${member}</div>
                </div>
                ${body}
            </body>
        </html>
        `
    },
    roomList:function(list){
        var html = `
        <div id="Rbutton"><button class="btn btn-primary" style="margin-left:20px;" onclick="openRoomMaker()">방 만들기</button></div><br>
        <script>
            function openRoomMaker() {
                document.getElementById("Rbutton").innerHTML = \`
                    <form action="/room_making_process" method="post">
                        <div class="input-group mb-3" style="margin-left:20px; width:350px">
                            <input type="text" name="title" placeholder="방 이름" class="form-control" aria-describedby="basic-addon2">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="submit">방 만들기</button>
                            </div>
                        </div>
                    </form>
                </div>\`;
            }
        </script>
        <div class="list-group">`;

        for(var i = 0; i < list.length; i++){
            html += `<a href="/chatroom?id=${list[i].id}" class="list-group-item list-group-item-action">${list[i].title}</a>`;
        }
        html += '</div>';
        return html;
    },
    chatBody:function(room, userId){
        var html = `<div id="chat"><ul id="messages" class="list-group">`;

        for(var i = 0; i < room.messages.length; i++){
            html += `<li class="list-group-item">${room.messages[i].userId}: ${room.messages[i].message}<div style="text-align:right; float:right;">${room.messages[i].date}</div></li>`;
        }
        html += `</ul>
                    <form id="msg_send">
                        <div class="input-group mb-3" style="float:left; width:350px">
                            <input id="msg" type="text" placeholder="메시지를 입력하세요." class="form-control" aria-describedby="basic-addon2">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary"> 전송 </button>
                            </div>
                        </div>
                    </form>
                    <form id="leave_chat" action="/">
                        <button class="btn btn-outline-secondary"> 방 나가기 </button>
                    </form>
                </div>
                <div id="userBox">
                    <ul id="userList" class="list-group">`
        for(var i = 0; i < room.users.length; i++){
            html += `<li id="User_${room.users[i]}" class="list-group-item">${room.users[i]}</li>`;
        }
        html += `</ul>
                </div>
                <script>
                $("#msg_send").submit(function(event){
                    event.preventDefault();
                    socket.emit('messagedetection', {msg: $("#msg").val(), userId: "${userId}", roomId: "${room.id}"});
                    $("#msg").val('');
                });
                $("#leave_chat").submit(function(event){
                    socket.emit('leave_chat', {roomId: "${room.id}", userId: "${userId}"});
                });
                socket.on('chat message', function(data){
                    $("#messages").append('<li class="list-group-item">' + data.userId + ": "+ data.msg + '<div style="text-align:right; float:right;">' + data.sendTime + '</div></li>');
                });
                socket.on('leave_chatroom', function(data){
                    if(data.roomId == ${room.id}){
                        $("#User_" + data.userId).remove();
                    }
                });
                socket.on('enter_chatroom', function(data){
                    if(data.roomId == ${room.id}){
                        $("#userList").append('<li id="User_' + data.userId + '" class="list-group-item">' + data.userId + '</li>');
                    }
                });
                </script>`;
        return html;
    },
    login:function(login = false){
        var html = `<div>`;
        if(login){
            html += `Welcome ${login.id}!`
            html += `<form action="/auth/logout_process" method="post" class="form-signout">
                        <button type="submit" class="btn btn-outline-danger" style="padding: 1px 5px;">로그아웃</button>
                    </form>`;
        }
        else{
            html += `<button type="button" onclick="location.href='/page/login.html'" class="btn btn-outline-danger" style="padding: 1px 5px;">로그인</button>`;
            html += `<button type="button" onclick="location.href='/page/register.html'" class="btn btn-outline-danger" style="padding: 1px 5px;">회원가입</button>`;
        }
        html += `</div>`;
        return html;
    }
}
