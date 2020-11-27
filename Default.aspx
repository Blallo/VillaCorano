<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VillaCorano.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
            <link rel="stylesheet" href="Content/full-slider.css" type="text/css" />
       <link rel="stylesheet" href="/Content/simple-sidebarDef.css" type="text/css" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <title>Villa Corano, Azienda Vitivinicola, Vini, Maremma Toscana Pitigliano, Bianco di Pitigliano Rosso di sovana, vini doc, Chardonnay, Sauvignon, Alicante, Aleatico, Cabernet</title>
</head>
<body class="back" style="background-color: #222222">
    <form id="form1" runat="server">
        <div id="wrapper" >
       

    

                <!-- Sidebar -->
        <div id="sidebar-wrapper">
               
        </div>
         <div id="page-content-wrapper">
             <div class="row">               <p id="msg"   style="color: wheat; font-size: 30px;font-family: 'harlow_solid_italicitalic" > <a id="msg2" href="DefaultEnter.aspx" style="color: whitesmoke; font-size: 20px">Entra Nel Sito ---></a> <img  src="Images/LogoVillacoranop.png"/></p>
           
      
               
                 </div>
                <p id="msg1"  style="color: wheat; font-size: 22px; line-height: 30px;" >
                      Nacqui in maniera del tutto casuale, forse trasportata dal vento o da uccelli di passaggio, a metà del 700 in una località 
                     demoninata 'Corano', di proprieta di Pietro Leopoldo Lorena. Nella contea di Pitigliano. 
                     Le mie origini rimasero tali sino al 1784, quando il podere venne affrancato da Giuseppe Gherardini agricoltore pitiglianese, 
                     la cui famiglia mi tenne in possesso fino ai primi del 900. Ricordo che questo fu il periodo in cui nacque il risorgimento 
                     maremmano, cioè quella bonifica integrale che vide in Leopoldo secondo Lorena l'arteficie di una colossale opera idraulica 
                     che sottrasse oltre venti ettari di terre alla palude e alla malaria.
                      Fu quello anche il periodo del mio maggiore sviluppo vegetativo, dovuto prevalentemente alla tipologia del terreno vulcanico, 
                      divenenedo ben presto la 'pianta' per eccellenza della zona. Le mio fronde, per circa 3 secoli, sono state testimoni
                      di mille fatti di vita quotidiana; ricordo soldati con camicia rossa che dopo essersi rifocillati, proseguivano con ardore
                      alla volta della vicina Roma, i banditi che nottetempo organizzavano ruberie ai danni dei grossi proprietari terrieri. 
                      Rammento un amore sorto tra una giovanoe contadina, che donò la sua castità ad un ardimentoso coetaneo che le prometteva 
                      eterno amore, che poi non mantenne. Ho subito nel tempo avversità atmosferiche che invano hanno infierito su di me,
                      lasciandomi evidenti segni, ma sono rimasta viva, eretta al cielo, radicata lla mia terra natia, pronta a proteggre 
                      raccolti e uomini come Stefano, conosciuto nel gennaio del 1969, che subito capì il segreto delle mie doti divinatorie 
                      che manifesto a persone speciali con semplici parole, che sussurro la mattina quando sorge il sole o la sera quando 
                      tramonta. E' in uno di questi tramonti 'surreali' che Stefano Formiconi, pioniere della viticoltura maremmmana, 
                      mi comunicò che aveva deciso di relaizzare un'azienda viticola che tenesse conto della spiccata vocazione territoriale.
                      Furono pertanto selezionati e impiantati vitigni autoctoni. Coadiuvati da altri internazionali, fu creata la base per la
                      futura 'Villa Corano', che prese definitivamente corpo nel 2001 con la costruzione della cantina,
                      un vero gioiello di tecnologia e sapiente tradizione. Villa Corano, la cui etimologia deriva dalle parole latine 
                      'Cor unum' che significano 'Un cuore solo', è oggi un punto di riferimento della enoviticoltura locale. 
                      Qui si producono vini legati alla tradizione come il bianco di pitigliano doc, il rosso di sovana doc, lo chardonnay,
                      il sauvignon, l'alicante, una riserva denominata Acheo ed infine le vendemmie tardive. 
                      Una produzione legata alla nostra cultura, che fa capire la sua origine, la sua anima ed il suo legame con l'ambiente,
                      nonchè l'amore profuso da Stefano al suo lavoro. Oggi villa corano accoglie migliaia di visitatori ogni anno, 
                      molti provenienti da paesi lontani che restano colpiti dalla bellezza dei luoghi e dalla mia nobile e longeva presenza.
                      Vengo ammirata, adulata, fotografata, ma nessuno di loro purtroppo riesce a capire il mio segrato ed il mio linguaggio viene confuso con il brusio del vento."
                 </p> 
             
            
         </div>
            </div>
    </form>
</body>
  <script src="Scripts/jquery-1.10.2.js"></script>
    <script src="Scripts/jquery-ui.js"></script>
     <script src="Scripts/Custom.js"></script>
     <script>
         $(function () {
              $('#msg1').hide();
              $('#msg2').hide();
              showText("#msg", "La quercia racconta di Villa Corano:", 0, 120);       
              $('#msg1').delay(5000).fadeIn(3500);
              $('#msg2').delay(8000).fadeIn(3500);
           });

   </script>

</html>
