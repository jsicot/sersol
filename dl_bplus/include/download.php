<?php
  /*
    Dans ce fichier se trouvent les fonctions qui vont nous permettre de télécharger le fichier ZIP depuis le serveur
    Et en particulier la fonction downloadFile() qui est la fonction mère
   */
  
  function downloadFile()
  {
    global $login;
    global $zip_file_path ;
    // Ce script va aller télécharger le fichier
    $ch = curl_init();
    // Page de connexion :
    $cookie_file_path = "cookies.txt";
    $url = "https://clientcenter.serialssolutions.com/CC/Login/Default.aspx";
  
    // begin script
    $ch = curl_init(); 
  
    print "Récupération page login\n";
    
    // extra headers
    $headers[] = "Accept: */*";
    $headers[] = "Connection: Keep-Alive";
    
    // basic curl options for all requests
    curl_setopt($ch, CURLOPT_HTTPHEADER,  $headers);
    curl_setopt($ch, CURLOPT_HEADER,  0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);         
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); 
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path); 
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path);
    curl_setopt($ch, CURLOPT_SSLVERSION,3); 
    curl_setopt($ch, CURLOPT_URL, $url );
    $content = curl_exec($ch); 
    $fields = getFormFields($content);
    $fields['_login$_login$UserName'] = $login;
    
    print "Veuillez saisir le mot de passe pour ".$fields['_login$_login$UserName']." :\n";
    // $fields['_login$_login$Password'] = trim(preg_replace('/\s\s+/', ' ', fgets(STDIN)));;
    $fields['_login$_login$Password'] = getPassword(true);
    // set postfields using what we extracted from the form
    $POSTFIELDS = http_build_query($fields); 
  
    
    print "\nEnvoi page login\n";
    // change URL to login URL
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_POST, 1); 
    curl_setopt($ch, CURLOPT_POSTFIELDS, $POSTFIELDS); 
    $result = curl_exec($ch);  
  
    // À partir d'ici on est connecté, 
    print "Login OK\n";
  
    // On va télécharger le fichier
    $url_file = 'https://clientcenter.serialssolutions.com/CC/Library/DataOnDemand/DownloadReport.aspx?LibraryCode=3IN&ObjectId=3IN_SSID.zip&ParentObjectId=ZIP';
    
    $fp = fopen($zip_file_path , 'w');
  
    curl_setopt($ch, CURLOPT_URL, $url_file); 
    curl_setopt($ch, CURLOPT_FILE, $fp);
    $data = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    fclose($fp);
  }
 
  function getFormFields($data)
  {
      if (preg_match('/(<form.*?<\/form>)/is', $data, $matches)) {
          $inputs = getInputs($matches[1]);
  
          return $inputs;
      } else {
          die('didnt find login form');
      }
  }

  function getInputs($form)
  {
    $inputs = array();
    
    $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);
    
    if ($elements > 0)
    {
      for($i = 0; $i < $elements; $i++)
      {
        $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);
        
        if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name))
        {
          $name  = $name[1];
          $value = '';
          
          if (preg_match('/value=(?:["\'])?([^"\'\s]*)/i', $el, $value))
          {
            $value = $value[1];
          }
          
          $inputs[$name] = $value;
        }
      }
    }
    return $inputs;
  }
  
  function getPassword($stars = false)
  {
    // Get current style
    $oldStyle = shell_exec('stty -g');
    
    if ($stars === false)
    {
      shell_exec('stty -echo');
      $password = rtrim(fgets(STDIN), "\n");
    }
    else
    {
      shell_exec('stty -icanon -echo min 1 time 0');
  
      $password = '';
      while (true)
      {
        $char = fgetc(STDIN);
        
        if ($char === "\n")
        {
          break;
        }
        else if (ord($char) === 127)
        {
          if (strlen($password) > 0)
          {
            fwrite(STDOUT, "\x08 \x08");
            $password = substr($password, 0, -1);
          }
        }
        else
        {
          fwrite(STDOUT, "*");
          $password .= $char;
        }
      }
    }
    
    // Reset old style
    shell_exec('stty ' . $oldStyle);
    
    // Return the password
    return $password;
  }
?>