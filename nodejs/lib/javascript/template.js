module.exports={
    HTML_Main:function(title = "ChatChat", member = "undefined", head = "Welcome to ChatChat!", body = ''){
        return `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            </head>
            <body>
                <h1 style="text-align:center; margin-top:20px; margin-bottom:15px;"><a href="/" style="text-decoration:none;">${head}</a></h1>
                <div class="header">
                    <div id="login" class="pull-right" style="text-align:right; margin-bottom:15px; margin-right:60px">${member}</div>
                </div>
                ${body}
            </body>
        </html>
        `
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
