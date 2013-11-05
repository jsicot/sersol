<?php
  date_default_timezone_set("Europe/Paris");
  $login = "sylvain.machefert@u-bordeaux3.fr";
  $zip_file_path = date("Ymd").'_3IN_SSID.zip';
  $csv_file_path = date("Ymd").'_3IN_SSID_original.csv';
  $final_file_path = date("Ymd").'_ERMS_bx3.csv';

  
  require_once("include/download.php");
  require_once("include/extract.php");
  require_once("include/filter.php");
  
  # 1. On télécharge le fichier ZIP (nécessite de s'authentifier)
  downloadFile();
  
  # 2. On extrait le fichier ZIP dans le répertoire courant
  extractZipFile();
  
  # 3. On filtre le fichier pour retirer ce qu'on ne veut pas voir exporter
  # et faire quelques corrections (liens factiva ...)
  filterFile();
  depuplicateFile();
  
  unlink($csv_file_path);
  unlink($zip_file_path);
?>
