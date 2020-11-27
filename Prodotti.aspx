<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Prodotti.aspx.cs" Inherits="VillaCorano.Maremma" %>
<asp:Content ID="Content1" ContentPlaceHolderID="CurrentStyleSheet" runat="server">
        <link href="Content/simple-sidebarProdotti.css" rel="stylesheet" type="text/css" />
        <link href="Content/full-slider.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="SideContent" runat="server">
    	
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">

    <div class="bb-custom-wrapper">		
         <div class="jumbotronA">			
	    <div class="row"  >
            <a class="aStyleArrow" id="bb-nav-first" href="#"   style="color: wheat; font-size: large;  background-color:rgba(0,0,0,0.8); box-shadow: 10px 10px 5px #222222; font-family: 'harlow_solid_italicitalic'; margin-left: 35px; margin-right: 35px" >Inizio </a>
			<a class="aStyleArrow" id="bb-nav-prev" href="#"   style="color: wheat; font-size: large;  background-color:rgba(0,0,0,0.8); box-shadow: 10px 10px 5px #222222; font-family: 'harlow_solid_italicitalic';margin-left: 35px; margin-right: 35px">Indietro</a>
		    <a class="aStyleArrow" id="bb-nav-next" href="#"  style="color: wheat; font-size: large;  background-color:rgba(0,0,0,0.8); box-shadow: 10px 10px 5px #222222; font-family: 'harlow_solid_italicitalic';margin-left: 35px; margin-right: 35px">Avanti</a>
			<a class="aStyleArrow" id="bb-nav-last" href="#"   style="color: wheat; font-size: large;  background-color:rgba(0,0,0,0.8); box-shadow: 10px 10px 5px #222222; font-family: 'harlow_solid_italicitalic';margin-left: 35px; margin-right: 35px">Fine</a>
		</div>	
		<div id="bb-bookblock" class="bb-bookblock"  style="padding-bottom: 500px;">			
		<div class="bb-item">
			<div class="bb-custom-side">
				<img class="img-responsive" src="Images/biancodipitigliano1.png"/>
		    </div>
			<div class="bb-custom-side">
		       <p class="styleTitle" style="color: wheat;">
                        Bianco di Pitigliano D.O.C Superiore "Cor Unum"</p>
                       <br/>
			   <ul class="styleBook" style="color: wheat;">
                  <li>Uvaggio: Procanico Rosa(Autoctono), Malvasia Toscana, Verdello (Autoctono) e Ansonica (Autoctono)</li>
                  <li>Vinificazione: in bianco a temperatura controllata</li>
                  <li>Colore: Giallo paglierino</li>
                  <li>Gradazione: 13°</li>
                  <li>Profumi: fruttato delicato, retrogusto amarognolo</li>
              </ul>
		</div>
	</div>
    <div class="bb-item">
      <div class="bb-custom-side">
        <img class="img-responsive" src="Images/corunumRosso.png"/>
      </div>
      <div class="bb-custom-side">                  
         <p class="styleTitle" style="color: crimson;">
          Rosso di Pitigliano D.O.C Superiore "Cor Unum"</p>
          <br/>
   	  <ul class="styleBook" style="color: crimson;">
          <li>Uvaggio: Sangiovese 50% (Autoctono), Ciliegiolo 30% , <br/> Cabernet Sauvignon 20%</li>
          <li>Vinificazione: macerato venti giorni in acciaio, affinato 12 mesi in barrique e 3 mesi in bottiglia</li>
          <li>Colore: Rosso rubino intenso</li>
          <li>Profum: fruttati rossi</li>
       </ul>
     </div>
     </div>                 
     <div class="bb-item">
        <div class="bb-custom-side">
        	<img class="img-responsive" src="Images/sauvignon.png"/>
        </div>
      	<div class="bb-custom-side">
            <p class="styleTitle" style="color: wheat;">
           Sauvignon i.g.t. Maremma Toscana</p>
          <br/>
		 <ul class="styleBook"style="color: wheat;">
            <li>Uvaggio: Sauvignon 100%</li>
            <li>Vinificazione: Fermentato a temperatura sotto i 18°C, mantenuto sulle fecce nobili per 6 mesi, <br/> "Batonage" ogni 15 giorni.</li>
            <li>Colore: Giallo paglierino con riflessi verdognoli</li>
            <li>Gradazione: 14°</li>
            <li>Profumi: Erbaceo con riferimenti al fico e all'ortica</li>
            <li>Caratteristiche: Ottima struttura, morbido, armonico, retrogusto persistente</li>
         </ul>
       </div>
     </div>                                  
     <div class="bb-item">
      <div class="bb-custom-side">
       	<img class="img-responsive" src="Images/chardonnay1.jpg"/>
      </div>
      <div class="bb-custom-side">
         <p class="styleTitle" style="color: wheat;">
            Chardonnay i.g.t Maremma Toscana
        </p>
         <br/>
	    <ul class="styleBook" style="color: wheat;" >
          <li>Uvaggio: Chardonnay 100%</li>
          <li>Vinificazione: Fermentato in Tonneaux da 5 0 0 L di rovere francese <br/> mantenuto sulle fecce nobili per 9 mesi, "Batonage" ogni 15 giorni</li>
          <li>Colore: Giallo paglierino con riflessi dorati</li>
          <li>Profumi: Fruttato maturo, vaniglia e crosta di pane</li>
          <li>Gradazione: 14°</li>
          <li>Caratteristiche: Stante la struttura e l'affinamento, <br />il vino potrà maturare per diversi anni</li>
        </ul>
      </div>
	</div>                                    
    <div class="bb-item">
      <div class="bb-custom-side">
      	<img class="img-responsive" src="Images/alicante12.png"/>
                        </div>
                    	<div class="bb-custom-side">
       <p class="styleTitle" style="color: crimson;">
         Alicante i.g.t Maremma Toscana</p> 
             <br/>

 <ul class="styleBook" style="color: crimson;">
   <li>Uvaggio: Alicante 100%</li>
   <li>Vinificazione: Macerato 2 0 giorni in acciaio, <br />affinato 6 mesi in legno di rovere francese e 3 mesi in bottiglia.</li>
   <li>Colore: Rosso rubino intenso</li>
   <li>Profumi: Rose e susine</li>
   <li>Gradazione: 1 3 . 5 0 °</li>
   <li>Caratteristiche: Succoso al palato, morbido, armonico, persistente,<br /> consigliato per carni rosse e formaggi stagionati.</li>
</ul>
</div>
</div>
<div class="bb-item">
   <div class="bb-custom-side">
	<img  class="img-responsive" src="Images/acheo2.png"/>
  </div>
  <div class="bb-custom-side">
      <p class="styleTitle" style="color: crimson;">
    "Acheo" Rosso I.G.T Maremma Toscana</p>
    <br/>
  <ul class="styleBook" style="color: crimson;">
      <li>Uvaggio: Merlot 40% , Cabernet Sauvignon 40%, Syrah 20%</li>
      <li>Vinificazione: Affinato per 18 mesi in barriques di Allier e Never<br/> e 4 mesi di bottiglia</li>
      <li>Colore: Rosso rubino intenso, tendente al granato</li>
      <li>Profumi: Vaniglia, frutti rossi (ribes, amarena, ciliegia)</li>
      <li>Gradazione: 14°</li>
      <li>Caratteristiche: Vino di grande struttura, morbido, persistente, <br/>con tannicità nobile equilibrata</li>
      </ul>
   </div>
 </div>                   
 <div class="bb-item">
   <div class="bb-custom-side">
    	<img class="img-responsive" src="Images/prospero.jpg"/>
   </div>
   <div class="bb-custom-side">
    <p class="styleTitle" style="color: wheat;">
       Prosoero <br/> rosato i.g.t Toscana</p>
       <br/>
    <ul class="styleBook" style="color: wheat;">
        <li>Uvaggio: Aleatico 100%</li>
        <li>Vinificazione: macerato 2 ore sulle bucce, fermentsto a 18°C di temperatura</li>
        <li>Colore: Rosa Pesca</li>
        <li>Profumo e Sapore: alla pesca a pasta bianca</li>
      </ul>
   </div>
 </div>                        
 <div class="bb-item">
   <div class="bb-custom-side">
     <img class="img-responsive" src="Images/iouliatico123.png"/>
   </div>
   <div class="bb-custom-side">
       <p class="styleTitle" style="color: crimson;">
      Iouliatico <br />Aleatico rosso i.g.t toscana</p>
      <br/>
     <ul class="styleBook" style="color: crimson;">
       <li>Uvaggio: Aleatico 100%</li>
       <li>Vinificazione: da uve appassite parzialmente in pianta; macerato per 20 giorni in acciaio e affinato 6 mesi in barrique</li>
       <li>Colore: Rosso rubino con riflessi violacei</li>
       <li>Profumi: note di violetta e confettura</li>
     </ul>
   </div>
 </div>                                     
 <div class="bb-item">
  <div class="bb-custom-side">
   	<img  class="img-responsive" src="Images/gaudium12.png"/>
  </div>
  <div class="bb-custom-side">
    <p class="styleTitle" style="color: wheat;">
    Gaudium<br/>Vendemmia tardiva bianco i.g.t toscana</p>
    <br/>
    <ul class="styleBook" style="color: wheat;">
      <li>Uvaggio: Malvasia aromatica</li>
      <li>Vinificazione: pigiato con torchio manuale, fermentato in barrique sulle fecce nobili rimanendo "sur lie" per 10 mesi. <br/> Batonage ogni 15 giorni, non chiarificato, imbottigliato a mano</li>
      <li>Colore: Giallo dorato</li>
      <li>Profumi: crosta di pane, frutta esotica, note vanigliati con sentori di moscato.</li>
    </ul>
 </div>
</div>
</div>			
</div>
</div>
       
<!-- /container -->
		<script src="Scripts/jquerypp.custom.js"></script>
		<script src="Scripts/jquery.bookblock.js"></script>
		<script>
			var Page = (function() {
				
				var config = {
						$bookBlock : $( '#bb-bookblock' ),
						$navNext : $( '#bb-nav-next' ),
						$navPrev : $( '#bb-nav-prev' ),
						$navFirst : $( '#bb-nav-first' ),
						$navLast : $( '#bb-nav-last' )
					},
					init = function() {
						config.$bookBlock.bookblock( {
							speed : 1000,
							shadowSides : 0.8,
							shadowFlip : 0.4
						} );
						initEvents();
					},
					initEvents = function() {
						
						var $slides = config.$bookBlock.children();

						// add navigation events
						config.$navNext.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'next' );
							return false;
						} );

						config.$navPrev.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'prev' );
							return false;
						} );

						config.$navFirst.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'first' );
							return false;
						} );

						config.$navLast.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'last' );
							return false;
						} );
						
						// add swipe events
						$slides.on( {
							'swipeleft' : function( event ) {
								config.$bookBlock.bookblock( 'next' );
								return false;
							},
							'swiperight' : function( event ) {
								config.$bookBlock.bookblock( 'prev' );
								return false;
							}
						} );

						// add keyboard events
						$( document ).keydown( function(e) {
							var keyCode = e.keyCode || e.which,
								arrow = {
									left : 37,
									up : 38,
									right : 39,
									down : 40
								};

							switch (keyCode) {
								case arrow.left:
									config.$bookBlock.bookblock( 'prev' );
									break;
								case arrow.right:
									config.$bookBlock.bookblock( 'next' );
									break;
							}
						} );
					};

					return { init : init };

			})();
		</script>
		<script>
				Page.init();
		</script>
</asp:Content>
