<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <script type="text/javascript" src="js/logincheck.js"></script>
        <title>設定編集用ログイン</title>
    </head>
    <body>
        <h1 class="top">ログイン画面</h1>
        <p>このページでは転送設定・パスワードの変更を行います。メールの送受信は<a href="rose.cs.meiji.ac.jp">SquirrelMail</a>で行います。</p>
        <?php
            if(isset($_GET["message"])){
                print '<div class="error">';
                print $_GET["message"];
                print '</div>';
            }
        ?>
        <form action="formwindow.php" method="POST">
            <table>
                <tr>
                    <td>id:</td>
                    <td><input type="text" id="id" name="id" /></td>
                </tr>
                    <td>password:</td>
                    <td><input type="password" id="password" name="password" /></td>
                </tr>
            </table>
            <input type="submit" id="login" value="ログイン" />
            <div class="help">
                <div>・idは「*****@cs.meiji.ac.jp」の*****部分です。</div>
                <div>・初期passwordはidと同じになっています。</div>
            </div>
        </form>
        <br />
        <br />
    </body>
</html>
