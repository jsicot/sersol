<?php
  function extractZipFile()
  {
    global $zip_file_path;
    global $csv_file_path;
    
    $zip = new ZipArchive;
    if (!file_exists($zip_file_path))
    {
      print "Le fichier n'existe pas, erreur dans le téléchargement ? => STOP\n";
      exit;
    }
    
    print "Ouverture de $zip_file_path\n";
    $res = $zip->open($zip_file_path);
    if ($res === TRUE) {
      $zip->renameName("3IN_SSID.csv", $csv_file_path);
      $zip->extractTo(".", $csv_file_path);
      $zip->close();
      print "Extraction zip => csv ok\n";
    }
    else
    {
      
      print "Problème d'extraction du fichier ZIP => STOP\n";
      die;
    }
  }
?>