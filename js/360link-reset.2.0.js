jQuery(document).ready(function ()
{
  // Since 360Link loads Prototype, need to use the jQuery prefix instead of $ 
  // to avoid conflicts with Prototype.

  // jQuery("head link").remove(); // Remove existing styles

  var results = "";
  var articleLinksdata = "";
  var bookLinksdata = "";
  var journalLinksdata = "";
  var dateRangedata = "";
  var DatabaseNamedata = "";
  var DatabaseLinkdata = "";
  var clicks = 0;
  var refinerlink = jQuery("#RefinerLink0 a").attr("href");
  var hasPrint = false;

  //define variables for capturing faulty URLs

  var link = "";
  var DBname = "";
  var ts = 0;
  var datastring = "";


  // BX3 : On va récupérer le lien du PEB
  var pebLink = jQuery("table.CandyWrapper").find("a.AnchorButton:contains('demande')").attr("href");

  // Build the citation
  var authorName = "";
  authorName = jQuery("td#CitationJournalAuthorValue, td#CitationBookAuthorValue").text();
  authorName = jQuery.trim(authorName); // Trim leading white space form author name

  // Journals

  if (format === "Journal" || format === "JournalFormat")
  {
    var journalName = "";
    journalName = jQuery("td#CitationJournalTitleValue").text();
    journalName = jQuery.trim(journalName); // Trim leading white space form journal name
    
    var articleName = "";
    articleName = jQuery("td#CitationJournalArticleValue").text();
    articleName = jQuery.trim(articleName); // Trim leading white space form article name
    
    var journalVol = "";
    journalVol = jQuery("td#CitationJournalVolumeValue").text();
    journalVol = jQuery.trim(journalVol); // Trim leading white space form journal volume
    if (journalVol !== "")
    {
      journalVol = ', <span id="CitationJournalVolumeValue">&nbsp;' + journalVol + '</span>';
    } // Add context so if var is blank, it won't display
    
    var journalIssue = "";
    journalIssue = jQuery("td#CitationJournalIssueValue").text();
    journalIssue = jQuery.trim(journalIssue); // Trim leading white space form journal issue #
    if (journalIssue !== "")
    {
      journalIssue = '<span id="CitationJournalIssueValue">&nbsp;(' + journalIssue + '),</span>';
    } // Add context so if var is blank, it won't display
    
    var journalDate = "";
    journalDate = jQuery("td#CitationJournalDateValue").text();
    journalDate = jQuery.trim(journalDate); // Trim leading white space form journal date
    if (journalDate !== "")
    {
      journalDate = '<span id="CitationJournalDateValue">&nbsp;(' + journalDate + '),</span>';
    } // Add context so if var is blank, it won't display
    
    var journalPages = "";
    journalPages = jQuery("td#CitationJournalPageValue").text();
    journalPages = jQuery.trim(journalPages); // Trim leading white space form journal pages
    if (journalPages !== "")
    {
      journalPages = '<span id="CitationJournalPageValue">&nbsp;p. ' + journalPages + '.</span>';
    } // Add context so if var is blank, it won't display
    
    var journalissn = "";
    var journalissnhtml = "";
    journalissn = jQuery("td#CitationJournalIssnValue").text();
    journalissn = jQuery.trim(journalissn); // Trim leading white space form journal issn
    if (journalissn !== "")
    {
      journalissnhtml = '<span id="CitationJournalIssnValue">&nbsp;(ISSN:&nbsp;' + journalissn + ')</span>';
    } // Add context so if var is blank, it won't display
    
    var journalDOI = "";
    var journalDOIhtml = "";
    journalDOI = jQuery("td#CitationJournalDOIValue").text();
    journalDOI = jQuery.trim(journalDOI);
    if (journalDOI !== "")
    {
      journalDOIhtml = '<span id="CitationJournalDOIValue">&nbsp;DOI&nbsp;:&nbsp;' + journalDOI + '.</span>';
    } // Add context so if var is blank, it won't display
    
    // Ok, let's get rid of that table and replace it with a semantic div for our citation
    if (authorName !== "")
    {
      var citationDiv = '<span id="CitationJournalAuthorValue">' + authorName + '.&nbsp;</span><span id="CitationJournalArticleValue">&#xAB;&nbsp;' + articleName + '&nbsp;&#xBB;.&nbsp;</span><span id="CitationJournalTitleValue"><em>' + journalName + '</em></span>' + journalVol + journalIssue + journalDate + journalPages + journalissnhtml + journalDOIhtml;
    }
    else
    {
      var citationDiv = '<span id="CitationJournalArticleValue">&#xAB;&nbsp;' + articleName + '&nbsp;&#xBB;.&nbsp;</span><span id="CitationJournalTitleValue"><em>' + journalName + '</em></span>' + journalVol + journalIssue + journalDate + journalPages + journalissnhtml + journalDOIhtml;
    }
    
    // Replace the final table with semantic HTML, along with the dynamic links
    // Remove the line above and uncomment the line below to add items to the bottom of your link resolver
    // Remove the line above and uncomment the line below to add items to the bottom of your link resolver
    var articleNameLink = encodeURI(articleName); // Encode the white space in the URL
    var journalTitleEncode = encodeURI(journalName);
    var authorNameLink = encodeURI(authorName); // Encode the white space in the URL
    
    // var nextstepsLink = '<li><a href="http://scholar.google.com/scholar?as_q=&num=10&btnG=Search+Scholar&as_epq=' + articleNameLink + '&as_oq=&as_eq=&as_occt=any&as_sauthors=' + authorNameLink + '&as_publication=' + journalTitleEncode + '&as_ylo=&as_yhi=&hl=en&lr=&safe=off" target="_blank">Rechercher l\'article sur Google Scholar</a></li>';
    
    var nextstepsLink = "<div class='zone_next'><a class='next-button' href='" + pebLink + "'>Demandez le document</a> via le service de Prêt Entre Bibliothèques (PEB)</div>";
    // <li>Faire une <a href='" + pebLink + "'>demande de prêt entre bibliothèques (PEB)</a>";
    if (journalDOI !== "")
    {
      nextstepsLink += '<li><a href="http://dx.doi.org/' + journalDOI + '" target="_blank">Rechercher cet article sur le web à partir de son identifiant DOI</a></li>';
    }
  }

  // Books
  if (format === "BookFormat" || format === "Book")
  {
    var bookTitle = jQuery("td#CitationBookTitleValue").text();
    bookTitle = jQuery.trim(bookTitle); // Trim leading white space form book title
    var bookDate = jQuery("td#CitationBookDateValue").text();
    bookDate = jQuery.trim(bookDate); // Trim leading white space form journal name
    var bookisbn = jQuery("td#CitationBookISBNValue").text();
    bookisbn = jQuery.trim(bookisbn); // Trim leading white space form journal name

    if (bookisbn !== "")
    {
      bookisbnhtml = '&nbsp;<span id="CitationBookISBNValue">(ISBN:&nbsp;' + bookisbn + ')</span>&nbsp;';
    } // Add context so if var is blank it will not display
    else
    {
      bookisbnhtml = "";
    }
    
    // Ok, let's get rid of that table and replace it with a semantic div for our citation
    
    var citationDiv = '<span id="CitationBookAuthorValue">' + authorName + '</span>, <span id="CitationBookTitleValue"><em>' + bookTitle + '</em></span>&nbsp;<span id="CitationBookDateValue">(' + bookDate + ')</span>.&nbsp;' + bookisbnhtml;
    
    // Replace the final table with semantic HTML, along with the dynamic links
    // Remove the line above and uncomment the line below to add items to the bottom of your link resolver
    var bookTitleLink = encodeURI(bookTitle); // Encode the white space in the URL
    if (bookisbn !== "")
    {
//      var nextstepsLink = '<li>Trouvez la version imprimée de cet ouvrage <a href="http://www.geobib.fr/babordplus/redirect.php?isbn=' + bookisbn + '" target="_blank">dans Babord+</a></li>';
      var nextstepsLink = '<div class="zone_next"><a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + bookisbn + '" class="next-button">Trouvez la version imprimée</a> de ce document dans Babord+, le catalogue des BU</div>';
    }
    else
    {
      var nextstepsLink = '<li>Trouvez la version imprimée de cet ouvrage dans <a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + bookTitle + '" target="_blank">Babord+</a></li>';
    }
  }

  // Unknown format - treat as book?

  if (format === "UnknownFormat" || format === "Unknown")
  {
    var bookTitle = jQuery("td#CitationUnknownPublicationValue").text();
    bookTitle = jQuery.trim(bookTitle); // Trim leading white space form book title
    var bookDate = jQuery("td#CitationUnknownDateValue").text();
    bookDate = jQuery.trim(bookDate); // Trim leading white space form journal name
    var bookisbn = jQuery("td#CitationBookISBNValue").text();
    bookisbn = jQuery.trim(bookisbn); // Trim leading white space form journal name
    if (bookisbn !== "")
    {
      bookisbn = '&nbsp;<span id="CitationBookISBNValue">(ISBN:&nbsp;' + bookisbn + ')</span>&nbsp;';
    } // Add context so if var is blank it will not display
    
    // Ok, let's get rid of that table and replace it with a semantic div for our citation
    
    var citationDiv = '<span id="CitationBookAuthorValue">' + authorName + '</span>&nbsp; <span id="CitationBookDateValue">(' + bookDate + ')</span>.&nbsp; <span id="CitationBookTitleValue"><em>' + bookTitle + '</em></span>&nbsp; <span id="CitationBookISBNValue">&nbsp; </span>';
    // Replace the final table with semantic HTML, along with the dynamic links
    
    // Remove the line above and uncomment the line below to add items to the bottom of your link resolver
    var bookTitleLink = encodeURI(bookTitle); // Encode the white space in the URL
    if (bookisbn !== "")
    {
      var nextstepsLink = '<li><a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + bookisbn + '" target="_blank">Trouvez cette référence dans Babord+</a></li>';
    }
    else
    {
      var nextstepsLink = '<li><a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + bookTitle + '" target="_blank">Trouvez cette référence dans Babord+</a></li>';
    }
  }

  // Dissertation

  if (format === "Dissertation" || format === "DissertationFormat")
  {
    var dissTitle = jQuery("td#CitationDissertationTitleValue").text();
    dissTitle = jQuery.trim(dissTitle); // Trim leading white space form book title
    var dissDate = jQuery("td#CitationDissertationDateValue").text();
    dissDate = jQuery.trim(dissDate); // Trim leading white space form journal name
    
    // Ok, let's get rid of that table and replace it with a semantic div for our citation
    var citationDiv = '<span id="CitationDissAuthorValue">' + authorName + '</span>, &nbsp; <i><span id="CitationBookTitleValue"><em>' + dissTitle + '</em></span></i>, &nbsp; <span id="CitationBookDateValue">' + dissDate + '</span>.';
    
    // Replace the final table with semantic HTML, along with the dynamic links
    // Remove the line above and uncomment the line below to add items to the bottom of your link resolver
    var bookTitleLink = encodeURI(bookTitle); // Encode the white space in the URL
    
    var nextstepsLink = '<li><a href="http://www.theses.fr/?q=&zone1=titreRAs&val1=' + bookTitle + '" target="_blank">Trouvez cette thèse sur theses.fr</a></li>';
  }

  // Patent

  if (format === "Patent" || format === "PatentFormat")
  {
    var patentTitle = jQuery("td#CitationPatentTitleValue").text();
    patentTitle = jQuery.trim(patentTitle); //Trim leading white space from patent title
    var patentDate = jQuery("td#CitationPatentInventorDateValue").text();
    patentDate = jQuery.trim(patentDate); //Trim leading white space from patent date
    authorName = jQuery("td#CitationPatentInventorValue").text();
    authorName = jQuery.trim(authorName);
    
    var patentTitleLink = encodeURI(patentTitle);
    var nextstepsLink = '<li><a href="http://www.google.com/?tbm=pts#tbm=pts&q=' + dissTitleLink + '">Trouvez ce brevet sur Google Patent.</a></li>';
    
    var citationDiv = '<span id="CitationPatentInventorValue">' + authorName + '</span>,&nbsp; <span id="CitationPatentTitleValue"><em>' + patentTitle + '</em>,&nbsp; <span id="CitationPatentInventorDateValue">' + patentDate + '</span>.</span>';
  }

  // Get information about displayed results and build results list
  // Modif Bx3 : on a des problèmes avec les liens pour enregistrer le lien direct
  // jQuery("table#JournalLinkTable,table#BookLinkTable").find("tr").each(function (index) { // Grab values from the results table
  jQuery("table#JournalLinkTable,table#BookLinkTable").children("tbody").children("tr").each(function (index)
    { // Grab values from the results table
      if (index !== 0)
      {
        // Get the article link, if available
        if (jQuery(this).find("#ArticleCL a").length > 1)
        { // There is an article link
          // Update BX3 : we've got the save ref element
          var newHref = jQuery(this).find("#ArticleCL a").last().attr("href");
          articleLinksdata = articleLinksdata + newHref + "|||";
        }
        else
        { // No article length
          articleLinksdata = articleLinksdata + "NA|||";
        }
        
        // Get the book link, if available
        if (jQuery(this).find("#BookCL a").length > 0)
        { // There is an book link
          var newHref = jQuery(this).find("#BookCL a").attr("href");
          bookLinksdata = bookLinksdata + newHref + "|||";
        }
        else
        { // No book length
          bookLinksdata = bookLinksdata + "NA|||";
        }
      
        // Get the journal link, if available
        if (jQuery(this).find("#JournalCL a").length > 0)
        { // There is a journal link
          var newHref = jQuery(this).find("#JournalCL a").attr("href");
          journalLinksdata = journalLinksdata + newHref + "|||";
        }
        else
        { // No article length
          journalLinksdata = journalLinksdata + "NA|||";
        }

        // Get the date range
        var newDates = jQuery(this).find("#DateCL").text();
        dateRangedata = dateRangedata + newDates + "|||";

        // Get the database name
        var newDBName = jQuery(this).find("#DatabaseCL").text();
        DatabaseNamedata = DatabaseNamedata + newDBName + "|||";
        
        // Get the database link
        var newDBLink = jQuery(this).find("#DatabaseCL a").attr("href");
        DatabaseLinkdata = DatabaseLinkdata + newDBLink + "|||";
      }
      results = index; // Get total number of results
    }
  );
  
  // Bust apart arrays into variabls we can call
  var articleLinks = articleLinksdata.split("|||");
  var bookLinks = bookLinksdata.split("|||");
  var journalLinks = journalLinksdata.split("|||");
  var dateRange = dateRangedata.split("|||");
  var DatabaseNames = DatabaseNamedata.split("|||");
  var DatabaseLinks = DatabaseLinkdata.split("|||");

  var additionalLinksnum = results - 1; // Number of links in the additional results list

  if ((articleLinks[0] === "NA") && (journalLinks[0] !== "NA") && (bookLinks[0] === "NA"))
  {
    // There was no article link, but there is a journal link
    TopDatabaseName = jQuery.trim(DatabaseNames[0]);
    
    // Check to see if top result is a print journal
    if (TopDatabaseName === "Print")
    {
      var topResultdiv = '<ul id="top-result"><li><a href="' + journalLinks[0] + '" class="article-button" target="_blank">Find a Copy</a> via<a href="' + DatabaseLinks[0] + '" class="SS_DatabaseHyperLink">' + jQuery.trim(DatabaseNames[0]) + '</a></li></ul>';
      var hasPrint = true;
    }
    else
    {
      var topResultdiv = '<ul id="top-result"><li><a href="' + journalLinks[0] + '" class="article-button" target="_blank">Consulter la revue en ligne</a> via<a href="' + DatabaseLinks[0] + '" class="SS_DatabaseHyperLink">' + jQuery.trim(DatabaseNames[0]) + '</a></li></ul>';
    }
  }
  else if ((articleLinks[0] === "NA") && (bookLinks[0] !== "NA") && (journalLinks[0] === "NA"))
  {
    var topResultdiv = '<ul id="top-result"><li><a href="' + bookLinks[0] + '" class="article-button" target="_blank">Consulter le livre en ligne</a> via<a href="' + DatabaseLinks[0] + '" class="SS_DatabaseHyperLink">' + jQuery.trim(DatabaseNames[0]) + '</a></li></ul>';
  }
  else
  {
    // There is an article link
    var topResultdiv = '<ul id="top-result"><li><a href="' + articleLinks[0] + '" class="article-button" target="_blank">Consulter le texte en ligne</a> disponible sur<a href="' + DatabaseLinks[0] + '" class="SS_DatabaseHyperLink">' + jQuery.trim(DatabaseNames[0]) + '</a> <a class="holding-details"><img src="http://gvsu.edu/icon/help.png" alt="" /></a><div class="tooltip"><p><a href="' + journalLinks[0] + '" style="text-decoration: none;">Consulter la revue</a></p><p style="font-size: 1em;"><i>Période couverte :</i><br />' + dateRange[0] + '</p></div></li></ul>';
  }

  // Additional results
  if (additionalLinksnum > 0)
  {
    // There are additional results
    if (additionalLinksnum === 1)
    {
      // Only 1 additional result
      var showResultsLabel = "Voir un résultat supplémentaire";
    }
    else
    {
      // More than one result
      var showResultsLabel = "Voir " + additionalLinksnum + " résultats supplémentaires";
    }
    
    // Now build the results div by iterating through the additional results the correct number of times starting with [1]
    var onlineAdditionalResults = "";
    var printAdditionalResults = "";
    
    var i = 1;
    while (i < results)
    {
      // Check for an article link
      
      if (articleLinks[i] !== "NA")
      {
        // Article link - article has to be online
        if (onlineAdditionalResults === "")
        {
          // First online article listed, add the header
          onlineAdditionalResults = onlineAdditionalResults + "<h4>En ligne</h4><ul>";
        }
      
        onlineAdditionalResults = onlineAdditionalResults + '<li><a href="' + articleLinks[i] + '" target="_blank">Texte en ligne</a> from <a href="' + DatabaseLinks[i] + '" class="SS_DatabaseHyperLink">' + DatabaseNames[i] + '</a><a class="holding-details"><img src="http://gvsu.edu/icon/help.png" alt="" /></a><div class="tooltip"><p><a href="' + journalLinks[i] + '" style="text-decoration: none;">Consulter la revue</a></p><p style="font-size: 1em;"><i>Période couverte :</i><br />' + dateRange[i] + '</p></div></li>';
      }
      else
      {
        // No article link

        // Check to see if it is available in print only and save it as a separate variable to be broken out in another list
        if (jQuery.trim(DatabaseNames[i]) === "Print at GVSU Libraries")
        {
          // Item is in print
          var hasPrint = true;
          if (printAdditionalResults === "")
          { // First online article listed, add the header
            printAdditionalResults = printAdditionalResults + "<h4>Print</h4><ul>";
          }
          
          printAdditionalResults = printAdditionalResults + '<li><a href="' + journalLinks[i] + '" target="_blank">Disponible </a> dans les bibliothèques de l\'université Rennes 2</li>';
        }
        else
        {
          // Item is online
          if (onlineAdditionalResults === "")
          {
            // First online article listed, add the header
            onlineAdditionalResults = onlineAdditionalResults + "<h4>En ligne</h4><ul>";
          }
          onlineAdditionalResults = onlineAdditionalResults + '<li><a href="' + journalLinks[i] + '" target="_blank">Consulter la revue en ligne</a> via <a href="' + DatabaseLinks[i] + '" class="SS_DatabaseHyperLink">' + DatabaseNames[i] + '</a><a class="holding-details"><img src="http://gvsu.edu/icon/help.png" alt="" /></a><div class="tooltip"><p style="font-size: 1em;"><i>Période couverte :</i><br />' + dateRange[i] + '</p></div></li>';
        }
      }
      i = i + 1;
    }
    
    if (onlineAdditionalResults !== "")
    {
      // There are online results, close the list
      onlineAdditionalResults = onlineAdditionalResults + '</ul>';
    }
    
    if (printAdditionalResults !== "")
    {
      // There are online results, close the list
      printAdditionalResults = printAdditionalResults + '</ul>';
    }
    
    var moreResultsdiv = '<div class="event-head">' + showResultsLabel + '</div><div class="event-body">' + onlineAdditionalResults + printAdditionalResults + '</div>';
    
    Resultdiv = topResultdiv + moreResultsdiv;
  }
  else
  {
    var Resultdiv = topResultdiv;
  }

  // No results. Serials Solutions page isn't very clear about this problem. Let's make it more clear.
  if (results === "")
  {
    // Item is not available online or in print
    var Resultdiv = '<div id="ContentNotAvailableTable"><p class="lib-big-text">Désolé, cette référence ne semble pas disponible en ligne.</p>';
    // '<p class="other-options">Vous pouvez tenter à nouveau votre chance en utilisant les options ci-dessous.</p>' + 
  }

  // Idiot div

  var idiotDiv = jQuery(".SS_HoldingText a").attr("href");

  if (typeof (idiotDiv) !== 'undefined')
  {
    // There is a choice between two different citations
    
    var whichCitationLink = "";
    var whichCitationJournal = "";
    var whichCitationIssn = "";
    var idiotResults = "";
    
    jQuery(".SS_HoldingText").each(function (n)
      {
        var newwhichCitationLink = jQuery(this).find("a").attr("href");
        whichCitationLink = whichCitationLink + newwhichCitationLink + "|||";
        
        var newwhichCitationJournal = jQuery(this).find(".SS_JournalTitle").text();
        whichCitationJournal = whichCitationJournal + newwhichCitationJournal + "|||";
        
        var newwhichCitationIssn = jQuery(this).find(".SS_IssnText").text();
        whichCitationIssn = whichCitationIssn + newwhichCitationIssn + "|||";
        
        idiotResults = n;
      }
    );
    
    // Create variables to work with
    idiotResults = idiotResults + 1;
    
    var citationLink = whichCitationLink.split("|||");
    var citationJournal = whichCitationJournal.split("|||");
    var citationIssn = whichCitationIssn.split("|||");
    
    topResultdiv = '<h4>Cette référence est disponible via les ressources suivantes :</h4><ul id="top-result">';
    
    t = 0;
    while (t < idiotResults)
    {
      // Build the list of results 
      topResultdiv = topResultdiv + '<li><a href="' + citationLink[t] + '">' + citationJournal[t] + ' ' + citationIssn[t] + '</a></li>';
      t = t + 1;
    }
    
    var Resultdiv = topResultdiv + '</ul>';
  }

  // Do the magic if this is a link resolver display page:
  // Rewrite Serials Solutions terrible page with a nice semantic, clean div full of easy-to-follow markup
  // Sadly, can't use replaceWith since IE 7 will delete the contents instead of replacing.
  // So we need to add a div wrapper around the Serials Solutions content to add this HTML into

  var query = document.location.search;
  var pairvalues = query.split("&");

  if (pairvalues[0] !== "?SS_Page=refiner")
  {
    // Don't rewrite the page if this is the citation form

    //check and see if there are print holdings.  if not, show a "search the catlog" link
    
    
    if (hasPrint != true && (format === "Journal" || format === "JournalFormat"))
    {
      if (journalissn !== "")
      {
        nextstepsLink = '<div class="zone_next"><a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + journalissn + '" class="next-button">Trouvez la version imprimée</a> de ce document dans Babord+, le catalogue de la BU</div>' + nextstepsLink;
        // nextstepsLink = '<li>Trouvez la version imprimée de cette revue <a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + journalissn + '" target="_blank">dans Babord+</a></li>' + nextstepsLink;
      }
      else
      {
        nextstepsLink = '<li class="appeasement">Trouvez la version imprimée de la revue <a href="http://scd.u-bordeaux3.fr/babordplus_outils/interro_light.php?q_light=' + journalTitleEncode + '" target="_blank">dans Babord+</a></li>' + nextstepsLink;
      }
    };
    
    //nextstepsLink = '<h2 style="text-align:left;">Autres options :</h2>' + nextstepsLink;
    
    if (results === "")
    {
      // BX3 Pas de résultats
      jQuery("#360link-reset").html('<div style="border:2px solid #FF9900; font-size:1.2em; width:550px; margin:auto; padding:10px; margin-top:10px; text-align:center"><b>Février 2013 : cet outil est en test</b>, n\'hésitez pas à nous <a href="http://scd.u-bordeaux3.fr/contact.php">signaler les problèmes que vous pourriez rencontrer</a></div><div id="page-content" style="margin: 0;"><h2 style="text-align:left;">Votre recherche :</h2><div id="citation">' + citationDiv + '&nbsp;<a href="' + refinerlink + '" title="Modifier votre recherche"><img src="http://catalogue.bu.univ-rennes2.fr/360link/css/pen.png" alt="Modifier votre recherche" /></a></div>' + Resultdiv + '<div id="next-step"><ul>' + nextstepsLink + '</ul></div></div><div class="clear"></div>' + '<p style="border-top:1px solid #DDD; padding-top:5px">Si vous pensez qu\'il s\'agit d\'une erreur, n\'hésitez pas à <a href="http://scd.u-bordeaux3.fr/contact.php">nous contacter</a>.</p></div>');
      
//      '<p>Si vous pensez qu\'il s\'agit d\'une erreur, n\'hésitez pas à <a href="http://scd.u-bordeaux3.fr/contact.php">nous contacter</a>.</p></div>'
    }
    else
    {
      // Normal
      jQuery("#360link-reset").html('<div style="border:2px solid #FF9900; font-size:1.2em; width:550px; margin:auto; padding:10px; margin-top:10px; text-align:center"><b>Février 2013 : cet outil est en test</b>, n\'hésitez pas à nous <a href="http://scd.u-bordeaux3.fr/contact.php">signaler les problèmes que pourriez rencontrer</a></div><div id="page-content" style="margin: 0;"><h2 style="text-align:left;">Votre recherche :</h2><div id="citation">' + citationDiv + '&nbsp;<a href="' + refinerlink + '" title="Modifier votre recherche"><img src="http://catalogue.bu.univ-rennes2.fr/360link/css/pen.png" alt="Modifier votre recherche" /></a></div>' + Resultdiv + '<div id="next-step"><ul>' + nextstepsLink + '</ul></div></div><div class="clear"></div><div style="position:relative; top:30px; text-align:center; margin:auto; color:#666; border-top:1px solid #CCC; padding:0px; width:400px;"><p style="padding:0px; margin:0px">En cas de soucis avec cet outil, n\'hésitez pas à <a href="http://scd.u-bordeaux3.fr/contact.php">nous contacter</a>.</p></div>');
    }
    
  }

  // Let's show a tooltip highlighting Document Delivery when the user has tried a few sources.
  // First, let's add the code for the tooltip:

  //jQuery("#next-step ul").append('<li class="tooltip">Having trouble? You can order a copy from Document Delivery, and they\'ll get it for you. It\'s free!<br /><a href="' + illiadLink + '" class="lib-db-access-button" style="font-size: 1.2em !important;">Order a Copy</a></li>');
  jQuery(".tooltip").hide();

  // Now let's count clicks
  jQuery(".event-body").hide();

  jQuery(".event-head").click
  (
    function ()
    {
      jQuery(".event-body").slideToggle(400);
      var current_text = jQuery(".event-head").text();
      if (current_text === "Masquer les résultats supplémentaires")
      {
        jQuery(".event-head").text('Voir plus de résultats');
      }
      else
      {
        jQuery(".event-head").text('Masquer les résultats supplémentaires');
      }
    }
  );

  jQuery(".holding-details").tooltip
  (
    {
      effect: 'slide',
      offset: [0, 0]
    }
  );

  jQuery("#360link-reset #page-content ul li a").click
  (
    function ()
    {
      // On va devoir gérer les stats
      return true;
      clicks = clicks + 1;
      link = encodeURIComponent(window.location);
      DBname = encodeURIComponent(jQuery(this).siblings("a.SS_DatabaseHyperLink").text());
      ts = Math.round((new Date()).getTime() / 1000);
      datastring = datastring + ts + "," + DBname + "," + link + "\n";

      if (clicks > 1)
      {
        jQuery(".tooltip").show();
        //lets also grab the openURL we are passing to the browser and pass it off
        //to a PHP script that will write it elsewhere, so it can be checked
        
        datastring = "data=" + datastring;
        jQuery.ajax
        (
          {
            dataType: "string",
            type: "POST",
            url: "http://catalogue.bu.univ-rennes2.fr/360link/url_write.php",
            data: datastring
          }
        );
        datastring = "";
      }
    }
  );
});
