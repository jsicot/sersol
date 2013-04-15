//--------------------------
// Adapted from J. Sicot who adapted it from :
// 
//--------------------------

/*
  Enrichissement de l'interface d'E-Journals à l'aide de différentes fonctionnalités.
  
  Auteurs :
		- Enrichissements Bordeaux 3 : Sylvain Machefert
		- Enrichissements Rennes 2 : Julien Sicot
		- Version originale : Karen A. Coombs ( www.librarywebchic.net )
	
	Historique des modifications Bordeaux :
	20130402 :
		- correction du lien vers les factiva
	
	20130104 :
		- Ajout d'une fonction cleaning. Pour le moment, nettoie l'affichage des dates
*/

var ROOT_URL = "http://www.geobib.fr/erms/";

$(function cleaning(){
	$(".SS_JournalCoverageDates").each(
		function (i)
		{
			var contenu_orig = $(this).text();
			contenu = contenu_orig.replace(/^du/, "");
			contenu = contenu.replace(/à\/au/, "→");
			if (contenu_orig != contenu)
			{
				$(this).text(contenu);
			}
		}
	);
	
	// On va nettoyer les liens ves Factiva
	$(".SS_HoldingData").each(
		function(i)
		{
			var lien = $('a[href*="factiva"]', this).get(0);
			if (lien != undefined)
			{
				$(lien).attr("href", "http://haysend.u-bordeaux3.fr/login?url=http://global.factiva.com/en/sess/login.asp?xsid=S002HJb2sVkZDFyMTZyMTEuMpMqM9ImNtmm5Ff9R9apRsJpWVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB");
			}
		}
	);
	
	$(".SS_UIDSearchNotePrefix").remove();
	
	// Affichage de la liste des bases de données
	// $(".SS_DataBaseIndex").remove();
	// $(".SS_ToolLabels").last().remove(); 
/*	$(".SS_EJP_TabList").append('<li class="SS_EJP_TabDB"><a class="SS_EJP_TabDB" href="#">Fournisseurs</a></li>'); */
});

$(function getISSNs(){

	$('.SS_JournalISSN').each(
		function (i){
			var ISSN = $(this).html();
			ISSN = ISSN.substr(1,ISSN.length -2);
			$(this).attr("id",ISSN);
			var	issnsstiret = ISSN.replace(/-|\//g, "");
			
			$.ajax({
				type: "GET",
				url: "http://xissn.worldcat.org/webservices/xid/issn/"+ ISSN +"?method=getMetadata&format=json&callback=markPeerReview",
				dataType: "script"
			});
		}
	);
	$('#CitationJournalIssnValue').each(
		function (i){
			var ISSN = $(this).html();
			
			$.ajax({
				type: "GET",
				url: "http://xissn.worldcat.org/webservices/xid/issn/"+ ISSN +"?method=getMetadata&format=json&callback=markPeerReview2",
				dataType: "script"
			});
		}
	);
});

$(function getISBNs(){
	
	$('.SS_BookISBN').each(
		function (i){
			var ISBN = $(this).html();
			ISBN = ISBN.substr(1,13);			
			$(this).attr("id",ISBN);
			isbnsstiret = ISBN.replace(/-|\//g, "");
			$('.SS_BookISBN#'+ISBN).prepend('<div id="journalcouv"><img src="http://images.amazon.com/images/P/'+isbnsstiret+'.08.THUMBZZZ.jpg" onerror="this.src =\'http://dl.dropbox.com/u/6135478/360/bookcover.gif\'"></div>');	
		}
	);
	
});

function markPeerReview(data){
	var issn = data.group[0].list[0].issn;
	//issn = issn.replace(/-|\//g, "");
	//$('.SS_JournalISSN#'+data.group[0].list[0].issn).append(''+data.group[0].list[0].issn+' <div id="journalcouv"><img src="http://www.extranet.elsevier.com/inca_covers_store/issn/'+ issn +'.gif" onerror="this.src =\'http://dl.dropbox.com/u/6135478/360/bookcover.gif\'"></div>')

	if (data.group[0].list[0].peerreview == 'Y'){

		$('.SS_JournalISSN#'+data.group[0].list[0].issn).append('<span class="peerreviewed"> Revue à comité de lecture </span>  <img src="' + ROOT_URL + 'img/peerreviewer.png" />')
	}
	if (data.group[0].list[0].rssurl)
  {
    if (data.group[0].list[0].rssurl.length > 0) {
      var rss = data.group[0].list[0].rssurl;
  		$('.SS_JournalISSN#'+data.group[0].list[0].issn).append('<span class="tocrss"><a href="' + data.group[0].list[0].rssurl + '" target="=_blank">  Sommaire du dernier numéro</a></span> ');
    }
	}
}

function markPeerReview2(data){
	if (data.group[0].list[0].peerreview == 'Y'){
		$('td #CitationJournalIssnValue').append(' <span class="peerreviewed">Revue à comité de lecture</span>  <img src="http://dl.dropbox.com/u/6135478/360/peerreviewer.png" />')
	}
	if (data.group[0].list[0].rssurl.length > 0) {
		var rss = data.group[0].list[0].rssurl;
		$('td #CitationJournalIssnValue').append('<span class="tocrss"><a href="' + data.group[0].list[0].rssurl + '" TARGET=_BLANK>| Consulter le dernier sommaire</a></span> ');
	}
}
