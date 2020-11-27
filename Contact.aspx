<%@ Page Title="Contatti" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Contact.aspx.cs" Inherits="VillaCorano.Contact" %>
<asp:Content ContentPlaceHolderID="CurrentStyleSheet" runat="server">
    <link href="Content/simple-sidebarContatti.css" rel="stylesheet" type="text/css" />
    <link href="Content/full-slider.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="col-lg-12 fontStyleCCenterMap">
      <h3 class="fontStyleC">Come si arriva a Villa Corano: </h3>
    </div>
        <div class="jumbotron row">
    <div class="col-lg-6">

    <address>
     <p class="fontStyleC">   
        La cantina è in località Corano, a circa 3 Km dal comune di Pitigliano (gr), in direzione Manciano e a 10 min dalle Terme di Saturnia.
        Si raggiunge comodamente essendo ubicata lungo la S. R. 74 Maremmana al Km 46,760 ed è eccezionalmente servita da un ampio accesso, sia per automobili che per pullman, dal quale si percorre per circa 150 metri un suggestivo viale di cipressi, immerso nei vigneti dell'azienda.
        AI Firenze - Roma, Uscita Orvieto, S. R. 74 Maremmana verso Bolsena, Saturnia - Pitigliano
        A12 Aurelia - Manciano - Saturnia - Pitigliano
     </p>  
    </address>
          </div>
            <div class="col-lg-6">
                <script src='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBViNF1mHFe8rQovgHkdhfjnc1pJTxTyOA'></script><div style='overflow:hidden;height:300px;width:500px;'><div id='gmap_canvas' style='height:500px;width:500px;'></div><div><small><a href="http://embedgooglemaps.com">google maps html</a></small></div><div><small><a href="https://www.billigleiebil.world/">Bare de beste bilutleiere</a></small></div><style>#gmap_canvas img{max-width:none!important;background:none!important}</style></div><script type='text/javascript'>function init_map() { var myOptions = { zoom: 13, center: new google.maps.LatLng(42.602393, 11.621354999999994), mapTypeId: google.maps.MapTypeId.ROADMAP }; map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions); marker = new google.maps.Marker({ map: map, position: new google.maps.LatLng(42.602393, 11.621354999999994) }); infowindow = new google.maps.InfoWindow({ content: '<strong style="color: black">Villa Corano</strong><br><label style="color: black">Strada Statale 74 Maremmana Km. 46,760, 58017 Loc. Corano, Pitigliano GR</label><br>' }); google.maps.event.addListener(marker, 'click', function () { infowindow.open(map, marker); }); infowindow.open(map, marker); } google.maps.event.addDomListener(window, 'load', init_map);</script>
            </div>
    </div>
    <div class="row fontStyleCCenterFooter">
    <div class="col-lg-12 ">
         <p title="Tel./Fax" class="">   
           <span  class="glyphicon glyphicon-phone-alt" > 0564-61.44.64</span >
             <br/>
              <span  class="glyphicon glyphicon-print" > 0564-61.44.64</span >
             <br/>
           <span class="glyphicon glyphicon-phone"> 349-50.16.047</span>
             <br/>
           <a class="glyphicon glyphicon-envelope" href="mailto:villacorano@tiscali.it"> villacorano@tiscali.it</a>
        </p>
   </div>
    </div>
</asp:Content>
