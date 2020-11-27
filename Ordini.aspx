<%@ Page Title="Ordini " Language="C#" MasterPageFile="~/Site.Master"   AutoEventWireup="True" CodeBehind="Ordini.aspx.cs" Inherits="VillaCorano.Ordini" %>
<%@ Register Src="Controls/SideBarForm.ascx" TagName="SideBarControl" TagPrefix="ucSideBar" %>

<asp:Content ContentPlaceHolderID="CurrentStyleSheet" runat="server">
    <link href="Content/simple-sidebarOrdini.css" rel="stylesheet" type="text/css" />
        <link href="Content/full-slider.css" rel="stylesheet" type="text/css" />
</asp:Content>

 
<asp:Content ID="SideContent" ContentPlaceHolderID="sideContent" runat="server">
   <ucSideBar:SideBarControl runat="server"/>
</asp:Content>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-lg-4 orderStyle">         
            <h1>Bianco di Pitigliano D.O.C Superiore <br/> "Cor Unum"</h1>          
            <asp:Image runat="server" ImageUrl="Images/Ordini/CorUnum_bianco.png" />           
            <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>       
            <asp:TextBox runat="server"  ID="txtNumBottiglieBiancoPitigliano" Width="70px" CssClass="spacing"></asp:TextBox>
            <asp:Button runat="server" ID="btnBiancoDiPititgliano" CssClass="spacing" Text="Aggiungi" OnClientClick="javascript:return add('BiancoPitigliano');return false;"/>
           <br/><asp:Label runat="server" style="color: wheat" ID="lblPrezzoBiancoPitigliano" Font-Size="26px" Text=" 6 €"></asp:Label>
             </div>
         <div class="col-lg-4 orderStyle">
           <h1 style="color: red">Rosso di Pitigliano D.O.C Superiore <br/> "Cor Unum"</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/rossosovana.png"/>
           <asp:Label runat="server"  Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" CssClass="spacing" runat="server" ID="txtNumBottiglieRossoPitigliano"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('RossoPitigliano');return false;"/>
           <br/><asp:Label   style="color: red" runat="server" ID="lblPrezzoRossoPitigliano" Font-Size="26px" Text=" 9 €"></asp:Label>
         </div>
         <div class="col-lg-4 orderStyle" >
            <h1>Sauvignon i.g.t. <br/> Maremma Toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/Souvignon1.png"/>
           <asp:Label runat="server"  Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" CssClass="spacing" ID="txtNumBottiglieSauvignon"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Sauvignon');return false;"/>
           <br/><asp:Label runat="server"  style="color: wheat" ID="lblPrezzoSauvignon" Font-Size="26px" Text=" 9 €"></asp:Label>
         </div>
    </div>
    <div class="row">
         <div class="col-lg-4 orderStyle">
            <h1>Chardonnay i.g.t  <br/> Maremma Toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/chardonnay1.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" CssClass="spacing" ID="txtNumBottiglieChardonnay"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Chardonnay');return false;"/>
           <br/><asp:Label runat="server" style="color: wheat" ID="lblPrezzoChardonnay" Font-Size="26px" Text=" 12 €"></asp:Label>
         </div>
         <div class="col-lg-4 orderStyle" >
            <h1 style="color: red" > Alicante i.g.t  <br/> Maremma Toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/alicante1.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" CssClass="spacing" ID="txtNumBottiglieAlicante"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Alicante');return false;"/>
           <br/><asp:Label runat="server" style="color: red" ID="lblPrezzoAlicante" Font-Size="26px" Text=" 12 €"></asp:Label>
        </div>
         <div  class="col-lg-4 orderStyle" >
           <h1 style="color: red">"Acheo" Rosso i.g.t  <br/> Maremma Toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/acheo75.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" ID="txtNumBottiglieAcheo" CssClass="spacing"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Acheo');return false;"/>
            <br/><asp:Label runat="server" style="color: red" ID="lblPrezzoAcheo" Font-Size="26px" Text=" 18 €"></asp:Label>
        </div>
    </div>
    <div class="row">
         <div class="col-lg-4 orderStyle" >
           <h1>Prospero Rosato i.g.t <br/> Toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/prospero1.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" ID="txtNumBottiglieProspero" CssClass="spacing"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Prospero');return false;"/>
             <br/><asp:Label runat="server"  style="color: wheat" ID="lblPrezzoProspero" Font-Size="26px" Text=" 9 €"></asp:Label>
        </div>
         <div class="col-lg-4 orderStyle" >
           <h1 style="color: red">Iouliatico Aleatico <br/> rosso i.g.t toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/Aleatico.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox Width="70px" runat="server" ID="txtNumBottiglieIuoliatico" CssClass="spacing"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Iouliatico');return false;"/>
             <br/><asp:Label runat="server" style="color: red" ID="lblPrezzoIouliatico" Font-Size="26px" Text=" 15 €"></asp:Label>
        </div>
         <div class="col-lg-4 orderStyle" >
            <h1>Gaudium vemdemmia tardiva <br/> bianco i.g.t toscana</h1>  
           <asp:Image runat="server" ImageUrl="Images/Ordini/Gavidium.png"/>
           <asp:Label runat="server" Text="Numero Bottiglie" CssClass="spacing"></asp:Label>
           <asp:TextBox  Width="70px" runat="server" ID="txtNumBottiglieGaudium" CssClass="spacing"></asp:TextBox>
           <asp:Button runat="server" Text="Aggiungi" CssClass="spacing" OnClientClick="javascript:return add('Gaudium');return false;"/>
             <br/><asp:Label runat="server" style="color: wheat" ID="lblPrezzoGaudium" Font-Size="26px" Text=" 18 €"></asp:Label>
        </div>       
    </div>
    <div id="dialog" class="col-lg-12 col-lg-offset-6 modal-dialog" style="display: none; text-align: center;"></div>
    <script type="text/javascript">

        $(document)
            .ready(function() {
                var arrayTxt = [
                   $('#<%= txtNumBottiglieBiancoPitigliano.ClientID%>'), $('#<%= txtNumBottiglieChardonnay.ClientID%>'), $('#<%= txtNumBottiglieRossoPitigliano.ClientID%>'),
                    $('#<%= txtNumBottiglieSauvignon.ClientID%>'), $('#<%= txtNumBottiglieAlicante.ClientID%>'), $('#<%= txtNumBottiglieAcheo.ClientID%>'),
                    $('#<%= txtNumBottiglieProspero.ClientID%>'),$('#<%= txtNumBottiglieGaudium.ClientID%>'),$('#<%= txtNumBottiglieIuoliatico.ClientID%>')
                ];

                $.each(arrayTxt,
                    function(index, value) {
                        onlyNumbers(value);
                    });

            });
   
        function onlyNumbers(ctrl) {
            $(ctrl).keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        }

        function add(type) {
            var order;
            var id = type;
            var tipo = type;
            var prezzo;
            switch (type) {
            case "BiancoPitigliano":
                tipo = "Cor Unum Bianco";
                order = $('#<%= txtNumBottiglieBiancoPitigliano.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoBiancoPitigliano.ClientID%>').text();
                break;
            case "Chardonnay":
                order = $('#<%= txtNumBottiglieChardonnay.ClientID%>').val();  
                prezzo = $('#<%= lblPrezzoChardonnay.ClientID%>').text();
                break;
            case "RossoPitigliano":
                order = $('#<%= txtNumBottiglieRossoPitigliano.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoRossoPitigliano.ClientID%>').text();
                tipo = "Cor Unum Rosso";
                break;
            case "Sauvignon":
                order = $('#<%= txtNumBottiglieSauvignon.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoSauvignon.ClientID%>').text();
                break;
            case "Alicante":
                order = $('#<%= txtNumBottiglieAlicante.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoAlicante.ClientID%>').text();
                break;
            case "Acheo":
                order = $('#<%= txtNumBottiglieAcheo.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoAcheo.ClientID%>').text();
                break;
            case "Prospero":
                order = $('#<%= txtNumBottiglieProspero.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoProspero.ClientID%>').text();
                break;
            case "Gaudium":
                order = $('#<%= txtNumBottiglieGaudium.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoGaudium.ClientID%>').text();
                break;
            case "Iouliatico":
                order = $('#<%= txtNumBottiglieIuoliatico.ClientID%>').val();
                prezzo = $('#<%= lblPrezzoIouliatico.ClientID%>').text();
                break;
            }
            if (order != null) {
                addBottle(order,id,tipo,prezzo);
            }
            return false;
        }
    </script>
     <script type="text/javascript">
         function ShowPopup(message) {
             $(function () {
                 $("#dialog").html(message);
                 $("#dialog").dialog({
                     closeOnEscape: false,
                     dialogClass: "noclose",
                     buttons: {
                         Close: function () {
                             window.location = window.location.href;
                             $(this).dialog('close');
                         }
                     },
                     modal: true
                 });
             });
         };
     </script>
                
    
</asp:Content>
    