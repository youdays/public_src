<?php
    //error発生時の処理
    function error($errorStr){
        header("Location: configtop.php?message=".$errorStr);
    }
    //ログイン処理
    function login($id,$password){
        $id = str_replace("'","'\''",$id); 
        $password = str_replace("'","'\''",$password);
        $command = "ldapsearch -h rose.cs.meiji.ac.jp -D 'uid=".$id.",ou=People,dc=sb,dc=cs,dc=meiji,dc=ac,dc=jp' -x -w '".$password."' -b 'uid=".$id.",ou=People,dc=sb,dc=cs,dc=meiji,dc=ac,dc=jp'";
        $output = array();
        $ret =null;
        exec($command,$output,$ret);
        if(isset($ret) && $ret==0){
            return true;
        }
        return false;
    }
?>
