<?php
  $filter_tmp_file = "ERMS_bx3_001_tmp.csv";
  function filterFile()
  {
    global $csv_file_path;
    global $filter_tmp_file;
    $fp = fopen($filter_tmp_file , 'w');
    
    # On va commencer par lire la première ligne
    $header = array();
    $reverse_header = array();
    
    if (($handle = fopen($csv_file_path, "r")) !== FALSE)
    {
      if (($data = fgetcsv($handle, 0, ",")) !== FALSE)
      {
        // On supprime le BOM du début de fichier
        $data[0] = preg_replace("/^\xEF\xBB\xBF/", "", $data[0]);
        fputcsv($fp, $data);
        $num = count($data);
        echo "$num champs à la première ligne\n";
        for ($c=0; $c < $num; $c++)
        {
          array_push($header, $data[$c]);
          $reverse_header[$data[$c]] = $c;
        }
      }

      $num_ligne = 0;
      # On va ensuite parcourir tout le fichier
      while (($data = fgetcsv($handle, 0, ",")) !== FALSE)
      {
        $num_ligne++;
        // On va faire les modifications qui nous intéressent dans le fichier
        $dbcode		= $data[$reverse_header["DatabaseCode"]];
        $provider	= $data[$reverse_header["Provider"]];
        
        if ($dbcode == "H2N")
        {
        	# Que sais-je, déjà dans sudoc
        }
        else if ($dbcode == "CO4")
        {
          # Frantext, pas vraiment des ebooks
        }
      	else if ($dbcode == "DGR")
        {
          # Oxford Digital Reference Shelf, saisi sudoc
        }
        else if ($dbcode == "EFU")
        {
          # Titres GALE
        }
        else if ( ($dbcode == "~IE") and ($provider == "Numilog") )
        {
          # Titres numilog
        }
        else if ($dbcode == "ESX")
        {
          # Academic search complete
        }
        else
        {
          # Ici c'est ce qu'on va conserver mais qu'on doit corriger
      		if ($dbcode == "FAC")
          {
            $data[$reverse_header["URL"]] = "http://haysend.u-bordeaux3.fr/login?url=http://global.factiva.com/en/sess/login.asp?xsid=S002HJb2sVkZDFyMTZyMTEuMpMqM9ImNtmm5Ff9R9apRsJpWVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB";
      		}
          
          if ($dbcode == "H9N")
          {
            $data[$reverse_header["DatabaseCode"]] = "GLM";
            $data[$reverse_header["Resource"]] = "Bibliothèque des Lettres";
            $data[$reverse_header["URL"]] = preg_replace("/ColEcritsArt/", "ColBdl", $data[$reverse_header["URL"]]);
          }
          fputcsv($fp, $data);
        }
        
        if (!($num_ligne % 5000))
        {
          print "Ligne ".$num_ligne."\n";
        }
      }
      fclose($handle);
    }
  }
  
  function depuplicateFile()
  {
    global $final_file_path;
    global $filter_tmp_file;

    $lines = file($filter_tmp_file );
    $lines = array_unique($lines);
    file_put_contents($final_file_path, implode($lines));

    print "Dédoublonnage de $filter_tmp_file => $final_file_path\n";

    unlink($filter_tmp_file );
  }

?>