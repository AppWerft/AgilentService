<?php
$list = array();
$dir = opendir( './');
 while (false !== ($file = readdir($dir))) {    
 	if ($file[0] != "." && $file[0] != '~' && is_file($file)) {
		array_push($list,array('md5'=>md5_file($file),'name'=>$file));
	}
}
echo json_encode($list);
closedir($dir);