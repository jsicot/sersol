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
  ini_set("display_errors", 0);
  // On vide la table de cache pour avoir tout en direct

  $sortie = Array();
  $sortie["dispo"] = 0;
  
  // On doit regarder ce qu'on a en entrée pour finir par avoir un isbn. On peut avoir des identifiants spécifiques à certains sites
  // dans le cas où l'on n'a pas l'isbn dès la liste de résultats.
  function getParam($code)
  {
    if (isset($_GET[$code]))
    {
      return $_GET[$code];
    }
    else
    {
      return null;
    }
  }
  
  $isbn = getParam("isbn");
  $issn = getParam("issn");
  
  $callback = getParam("callback");

  if ( $isbn)
  {
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
    elseif (preg_match("/,/", $isbn))
    {
      $tab_isbn = preg_split("/,/", $isbn);
      $isbn10 = trim($tab_isbn[0]);
      $isbn13 = trim($tab_isbn[1]);
    }
    $url = "http://babordplus.univ-bordeaux.fr/resultat.php?type_rech=ra&bool[]=&index[]=ean&value[]=".$isbn10."&bool[]=OR&index[]=ean&value[]=".$isbn13."&bool[]=AND&index[]=fulltext&value[]=&spec_expand=0&spec_expand=1&typedoc=&docnum=&spec_tri_annee_start=&spec_tri_annee_end=&sort_define=score&sort_order=1&rows=10";
    
    $html = file_get_html($url);
    if (
        (sizeof($html->find('ul[class=sid-suggest]')) > 0)
        or
        (sizeof($html->find('p[class=sid-no-result]')) > 0)
       )
    {
      $sortie["dispo"] = 0;
    }
    else
    {
      $sortie["url"] = "http://scd.u-bordeaux3.fr/babordplus_outils/redirect.php?isbn10=".$isbn10."&isbn13=".$isbn13;
      $sortie["dispo"] = 1;
    }
  }
  elseif ($issn)
  {
    $url = "http://babordplus.univ-bordeaux.fr/resultat.php?type_rech=ra&bool[]=&index[]=issn_tous&value[]=".$issn."&bool[]=AND&index[]=fulltext&value[]=&bool[]=AND&index[]=fulltext&value[]=&spec_expand=1&typedoc=&docnum=&spec_tri_annee_start=&spec_tri_annee_end=&sort_define=score&sort_order=1&rows=10&fq=docnum:(\"0\")";
    $html = file_get_html($url);
    
    if (
        (sizeof($html->find('ul[class=sid-suggest]')) > 0)
        or
        (sizeof($html->find('p[class=sid-no-result]')) > 0)
       )
    {
      $sortie["dispo"] = 0;
    }
    else
    {
      $sortie["url"] = "http://scd.u-bordeaux3.fr/babordplus_outils/redirect.php?issn=".$issn;
      $sortie["dispo"] = 1;
    }
    
  }
  elseif ($sortie["error"] == "")
  {
    $sortie["dispo"] = 0;
  }

  print $callback."(".json_encode($sortie).")";
  exit;
?>
