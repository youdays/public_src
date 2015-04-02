<?php
	if($argc!=2){
		exit("cgi error");
	}
	$forwardaddress = $argv[1];
	$forwardaddress = str_replace('\t','\n',$forwardaddress);

	//.forwardファイルの退避
	$command = 'cp ~/.forward ~/.forward.old';
	$output = array();
	$ret = null;
	exec($command,$output,$ret);
	if($ret != 0){
		exit($ret);
	}

	$command = 'echo  -e \'~/Maildir/\n'.$forwardaddress.'\' > ~/.forward.new';
	$output = array();
	$ret = null;
	exec($command,$output,$ret);
	if($ret != 0){
		exit($ret);
	}

	$command = 'cp ~/.forward.new ~/.forward';
	$output = array();
	$ret = null;
	exec($command,$output,$ret);
	if($ret != 0){
		exit($ret);
	}

	$command = 'rm ~/.forward.old ~/.forward.new';
	$output = array();
	$ret = null;
	exec($command,$output,$ret);
	if($ret != 0){
		exit($ret);
	}

	exit($ret);
?>
