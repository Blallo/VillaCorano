<%@ Page Title="Maremma Toscana" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" %>
<asp:Content ContentPlaceHolderID="CurrentStyleSheet" runat="server">
    <link href="Content/simple-sidebarMaremma.css" rel="stylesheet" type="text/css" />
     <%--   <link href="Content/full-slider.css" rel="stylesheet" type="text/css" />--%>
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    
   

        <div class="col-lg-12">
<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <%--<ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
    <li data-target="#myCarousel" data-slide-to="3"></li>
  </ol>--%>

  <!-- Wrapper for slides -->
  <div class="carousel-inner" role="listbox">
         <div  id="1" class="item  active">
             <img class="img-responsive-mine" src="Images/vigne.jpg" />
         <div class="carousel-caption">
        
    
      </div>
    </div>
        <div  id="2" class="item">
             <img class="img-responsive-mine" src="Images/lavoratori.jpg" />
         <div class="carousel-caption">
      </div>
    </div> 
    <div  id="3" class="item">
         <img class="img-responsive-mine" src="Images/vigneto.jpg" />
         <div class="carousel-caption">
        

    </div>
        </div>
      
  </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
            </div>

        <div class="col-lg-12">
      
                <p class="fontStyleMar">
A chi vi giunge per la prima volta (dalla Maremma lungo la SS.74), Pitigliano si offre improvviso al colpo d'occhio del visitatore con una visione straordinaria ed assolutamente inaspettata.
L'abitato a strapiombo sulla rupe di tufo da cui sorge come per magia, è incastonato in una mirabile scenografia di dirupi, piccole valli, verdi declini, torrentelli e cascate. Se si giunge di notte, allora l'abitato illuminato si staglia nel buio come sospeso nel tempo. Sulla rupe abitarono gli uomini dell'età del bronzo, poi gli etruschi, poi i romani.
La Sinagoga, con il forno degli azzimi e gli altri locali annessi, videro il fiorire per oltre cinque secoli, di una Comunità ebraica, che ha caratterizzato Pitigliano - per questo detta la "piccola Gerusalemme" - per la sua vivacità economica e culturale, ma soprattutto per l'eccezionale esempio di convivenza fra ebrei e cristiani, consolidato nel corso dei secoli fino ai nostri tempi.
Ma gli aspetti più straordinari di Pitigliano sono costituiti dall'eccezionale compattezza dell'abitato con le sue case di tufo, i suoi vicoli, le sue forme popolari che sono il contesto ineliminabile degli stessi monumenti: dalla città sotterranea, che si spinge nelle viscere della rupe, con cunicoli, grotte, colombari, cantine, antiche abitazioni rupestri e che costituisce un ambiente misterioso e particolarissimo.
Queste caratteristiche rendono Pitigliano un mondo fuori dal comune, inconsueto, eccezionale e tutto da scoprire.
                </p>
            </div>
       
    <script>
    //    $('.carousel').on('slide.bs.carousel', function (ev) {
    //        var id = ev.relatedTarget.id;
    //        switch (id) {
             
    //            case "1":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/biancodipitigliano.jpg)");
    //                break;
    //            case "2":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/biancodipitigliano.jpg)");
    //                break;
    //            case "3":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/sauvignon.png)");
    //                break;
    //            case "4":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/chardonnay.jpg)");
    //                break;             
    //            case "5":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/alicante.png)");
    //                break;
    //            case "6":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/prospero.JPG)");
    //                break;
    //            case "7":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/prospero.png)");
    //                break;
    //            case "8":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/iouliatico.png)");
    //                break
    //            case "9":
    //                $("#sidebar-wrapper").css('background-image', "url(Images/gaudium.png)");
    //                break;
    //            default:
    //                $("#sidebar-wrapper").css('background-image', "url(Images/biancodipitigliano.jpg)");
    //                break;
    //        }
       
    //});
</script>
</asp:Content>

