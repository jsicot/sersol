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
*/

var ROOT_URL = "http://www.geobib.fr/erms/";

$(function cleaning(){
	$(".SS_JournalCoverageDates").each(
		function (i)
		{
			var contenu = $(this).text();
			contenu = contenu.replace(/^du/, "");
			contenu = contenu.replace(/à\/au/, "-");
			$(this).text(contenu);
		}
	)
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
  		$('.SS_JournalISSN#'+data.group[0].list[0].issn).append('<span class="tocrss"><a href="' + data.group[0].list[0].rssurl + '" TARGET=_BLANK>  Sommaire du dernier numéro</a></span> ');
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