<?php
  /*
  Fichier  : getdispo.php
  Auteur    : Sylvain Machefert (Bordeaux 3)
  Fonction  : Indique si un document est présent dans BaborD+
  Paramètre :
    - q : isbn
  Retour :
    - status : 1 pour une opération qui s'est déroulée correctement, 0 pour une opération avec erreur
    - error : message d'erreur si nécessaire
    - data["dispo"] : 0 pour un document absent; 1 pour un document présent
  
  Historique :
    - 20130415 : version modifiée du script pour SerialSolutions
    - 20110914 : version initiale du script

  */
  
  require_once("include/simple_html_dom.php");
  require_once("include/ISBN.php");
  require_once("include/connect.php");
  ini_set("display_errors", 0);
  // On vide la table de cache pour avoir tout en direct
//  SQL("truncate table ".$config["TAB_CACHE"]);

  $sortie = Array();
  $sortie["function"] = "getdispo";
  $sortie["status"] = 0; // Par défaut on considère qu'il y a eu un problème, on mettra à jour dans les endroits où ça passe bien
  $sortie["error"] = "";
  $sortie["data"] = Array();
  
  // On doit regarder ce qu'on a en entrée pour finir par avoir un isbn. On peut avoir des identifiants spécifiques à certains sites
  // dans le cas où l'on n'a pas l'isbn dès la liste de résultats.
  $tokens = explode(":", $q);
  if ($tokens[0] == "isbn") {
    $isbn = $tokens[1];
  } else {
    $isbn = translate_site_id($tokens[0], $tokens[1]);
  }
  
  $sortie["data"]["req"] = $q;
  
  if ($isbn == -1)
  {
    // On n'a pas réussi à traduire le site id, on va donc l'indiquer en sortie
    $sortie["error"] = "Traduction du code d'entrée impossible (".$q.")";
    $isbn = "";
  }

  if ($isbn)
  {
    
    $sortie["data"]["isbn"] = $isbn;
    
    $isbn10 = "";
    $isbn13 = "";
    
    $isbn = str_replace("-", "", $isbn);


    if (strlen($isbn) == 10)
    {
      $isbn10 = $isbn;
      $isbn13 = convertToISBN13($isbn);
    }
    elseif (strlen($isbn) == 13)
    {
      $isbn10 = convertToISBN10($isbn);
      $isbn13 = $isbn;
    }
    else
    {
      // On a un problème avec l'isbn passé en entrée !
      $sortie["error"]  = "Problème d'isbn (".$isbn." / taille : ".strlen($isbn).")";
      $sortie["status"] = 0;
    }

    
    if (!$sortie["error"])
    {
      // On va regarder dans le cache si on a l'info de disponibilité pour cette ressource
      // On limite cette gestion du cache à 12 heures 
      $res = SQL("select dispo from ".$config["TAB_CACHE"]." where (isbn10 = '$isbn10' or isbn13 = '$isbn13') and TIMESTAMPDIFF(HOUR, timestamp, now()) < 12");
      if (mysql_numrows($res) == 1)
      {
        // On a une réponse dans le cache, on va l'utiliser
        $row = mysql_fetch_array($res, MYSQL_NUM);
        $sortie["data"]["dispo"] = intval($row["0"]);
        $sortie["status"] = 1;
      }
      else
      {
        $url = "http://babordplus.univ-bordeaux.fr/resultat.php?type_rech=ra&bool[]=&index[]=ean&value[]=".$isbn."&bool[]=AND&index[]=fulltext&value[]=&bool[]=AND&index[]=fulltext&value[]=&spec_expand=1&typedoc=&docnum=&spec_tri_annee_start=&spec_tri_annee_end=&sort_define=score&sort_order=1&rows=10";
        $html = file_get_html($url);
    
        if (sizeof($html->find('p[class=sid-no-result]')) > 0)
        {
          $sortie["data"]["dispo"] = 0;
          $sortie["status"] = 1;
        }
        else
        {
          foreach($html->find('div[class=sid-number]') as $element)
          {
            $sortie["data"]["dispo"] = 1;
            $sortie["status"] = 1;
          }
        }
        
        SQL("insert into ".$config["TAB_CACHE"]." (`isbn10`, `isbn13`, `dispo`) values ('$isbn10', '$isbn13', '".$sortie["data"]["dispo"]."')");
      } 
    }
  }
  elseif ($sortie["error"] == "")
  {
    $sortie["status"] = 0;
    $sortie["error"]  = "Manque un argument en paramètre de getdispo.php";
  }

  print json_encode($sortie);
  exit;
  
  function translate_site_id($id_site, $id_doc) {
    global $config;
    $req = "select * from ".$config["TAB_EQUIV"]." where id_site = '".$id_site."' and id_doc = '".$id_doc."';";

    $res = SQL($req);
    if (mysql_numrows($res) == 0)
    {
      // On doit lancer la recherche sur le site pour obtenir l'isbn
      if ($id_site == "fnac") {
        $url = "http://livre.fnac.com/a${id_doc}/";
        $pattern = '<th scope="row" align="left"><span>ISBN</span></th>\\s+'
                 . '<td><span>\\s+'
//                 . '([\\dX]+)\\s+'
                 . '([\\dX]+)\\s*' // Correc SMA
//                 . '</span></td>';
                 . '</tr>';
        // Mise à jour 20121024 : changement format sur site fnac.com, on récupère maintenant dans les meta, plus simple
        $pattern = '<meta property="og:isbn" content="([\\dX]+)"';
      } else if ($id_site == "chapitre") {
        $url = "http://www.chapitre.com/CHAPITRE/fr/BOOK//,${id_doc}.aspx";
        $pattern = '<div class="productDetails-items-content">\\s+'
                  . '(\\d{13})\\s+'
                  . '</div>';
      }
        
      $http_content = file_get_contents($url);
      
      if (preg_match("|404|", $http_response_header[0]))
      {
        return -1;
      }
      
      if (!preg_match("|${pattern}|m", $http_content, $matches)) { // XXX: set ISBN to NULL if not available for this site ID ??
        return -1;
      }
      else
      {
        $isbn = $matches[1];
      }
      SQL("insert into ".$config["TAB_EQUIV"]." (`id_site`, `id_doc`, `isbn`) values ('$id_site', '$id_doc', '$isbn');");
    }
    else
    {
      // On va récupérer l'isbn stocké dans la base.
      $row = mysql_fetch_assoc($res);
      $isbn = $row["isbn"];
    }

    return $isbn;
  }
?>
