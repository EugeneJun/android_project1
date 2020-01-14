const express = require('express'),
template = require('./lib/javascript/template.js'),
{Room, Message,} = require('./lib/javascript/roomController.js'),
http = require('http'),
app = express(),
server = http.createServer(app),
url = require('url'),
mongoose = require('mongoose'),
session = require('express-session'),
MongoStore = require('connect-mongo')(session),
io = require('socket.io').listen(server),
fs = require('fs'),
alert = require('alert-node'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost/login_system', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
}));

const userSchema = new mongoose.Schema({
    id: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

async function registerId(id, password) {
    const user = new User({
        id: id,
        password: password
    });

    const result = await user.save();
    console.log(result);
}

async function getUsers(id, password) {
    const users = await User.find({
        id: id,
        password: password
    });
    return Boolean(!(Object.keys(users).length === 0));
}

app.get('/',function(req,res){
    var html = template.HTML_Main(undefined, template.login(req.session.user), undefined, template.roomList(Room.instances));
    res.send(html);
});

app.get('/page/:pageID', function(req, res){
    fs.readdir('./lib/contents', function(err, files){
        console.log(req.params.pageID);
        fs.readFile(`./lib/pages/${req.params.pageID}`, function(err, data){
            var body = data;
            var html = template.HTML_Main(undefined, template.login(req.session.user), undefined, data);
            res.send(html);
        });
    });
})

app.post('/room_making_process', function(req, res){
    console.log(req.body.title);
    if(req.session.user){
        var title = req.body.title;
        var userId = req.session.user.id;
        var room = new Room(title, userId);
        res.redirect('/');
    }
    else{
        alert("로그인 후 이용해주세요!");
    }
})

app.get('/chatroom', function(req, res){
    var roomId = req.query.id;
    var chat = template.chatBody(Room.instances[roomId]);
    var userId = req.session.user.id;
    Room.instances[roomId].users.push(userId);
    var html = template.HTML_Main(undefined, template.login(req.session.user), Room.instances[roomId].title + "채팅방", chat);
    res.send(html);
})

app.post('/send_message', function(req, res){
    var text = req.body.message;
    var roomId = req.query.id;
    var userId = req.session.user.id;
    var sendTime = Date.now;
    var message = new Message(text, userId, sendTime);
    Room.instances[roomId].messages.push(message);
    res.redirect('/chatroom?id=' + roomId);
})

app.post('/auth/login_process', function(req, res){
    var userId = req.body.ID;
    var userPassword = req.body.password;
    var is_user;
    getUsers(userId, userPassword).then(function(data){
        is_user = data;
        if(is_user){
            req.session.user = {
                id: userId,
                pw: userPassword,
                authorized: true
            };
            alert("반갑습니다! " + req.session.user.id + "님");
            res.redirect('/');
        }
        else{
            console.log("denied");
            alert("로그인 실패");
            res.redirect('/');
        }
    });
});

app.post('/auth/logout_process', function(req, res){
    console.log('로그아웃 처리');
    req.session.destroy(function (err) {
        if (err) {
            console.log('세션 삭제시 에러');
                return;
        }
        console.log('세션 삭제 성공');
        res.redirect('/');
    });
});

app.post('/auth/register_process', function(req, res){
    var userId = req.body.ID;
    var userPassword = req.body.password;
    registerId(userId, userPassword).then(function(){
        console.log("회원가입 완료");
    });
    alert("회원가입 성공! 로그인 해주세요~");
    res.redirect('/');
});

server.listen(3000,()=>{
    console.log('Node app is running on port 3000')
});

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('join', function(userNickname) {
        console.log(userNickname +" : has joined the chat "  )
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ")
    });
    socket.on('messagedetection', (senderNickname,messageContent) => {
        //log the message in console
        console.log(senderNickname+" :" +messageContent)
        //create a message object
        let message = {"message":messageContent, "senderNickname":senderNickname}
        // send the message to the client side
        socket.emit('message', message )
    });
    socket.on('disconnect', function() {
        console.log('user has left ')
        socket.broadcast.emit( "userdisconnect" ,' user has left')
    });
});
