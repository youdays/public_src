<?php
    if($argc!=1){
        exit("argc error");
    }
    $command = 'cat ~/.forward';
    $output = array();
    $ret = null;
    exec($command,$output,$ret);
    if($ret != 0){
        exit($ret);
    }
    array_shift($output);
    foreach($output as $line){
        print $line."\n";
    }
    exit($ret);
?>
