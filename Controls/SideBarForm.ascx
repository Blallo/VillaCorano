<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SideBarForm.ascx.cs" Inherits="VillaCorano.Controls.SimpleSideBar" %>
<asp:HiddenField runat="server" ID="hfPrezzo"/>
<asp:HiddenField runat="server" ID="hfOrdine"/>


<div class="col-lg-push-4" >
    <asp:Label runat="server" Text="Carrello: " ForeColor="Wheat"></asp:Label>
</div>
<div class="col-lg-push-12">
    <ul class="listyle" id="lstCarrello">
        
    </ul>
</div>

<div class="col-lg-push-4" id="divTotale">
    <hr/>
   <label style="color: wheat">Ordine: </label><label id="PrezzoTotale"></label ><label style="color: wheat"> €</label><br/>
 
   <label style="color: wheat">Spese di Spedizione*: </label><label id="SpeseSpedizione"></label ><label style="color: wheat"> €</label>
    <hr/>
    <label style="color: wheat">Totale: </label><label id="TotaleOrdine"></label ><label style="color: wheat"> €</label>
</div>
<div class="col-lg-push-4">
    <asp:Label runat="server" Text="Metodo di Pagamento" ID="lblmdp"></asp:Label>
</div>
<asp:DropDownList runat="server" ID="ddlMetodoDiPagamento">
  <asp:ListItem Text="Bonifico Bancario" Value="Bonifico"></asp:ListItem>
</asp:DropDownList>
<div id="accordion">
  <h3 style="color: wheat" >Indirizzo di spedizione:</h3>
    <div>
<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Nome" ID="lblNome"></asp:Label>
</div>
<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtNome"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvlblNome" ControlToValidate="TxtNome" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Cognome" ID="lblCognome"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtCognome"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvCognome" ControlToValidate="txtCognome" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Email" ID="lblEmail"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtEmail"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvEmail" ControlToValidate="txtEmail" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>


<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Telefono" ID="lblTelefono"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtTelefono"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="RequiredFieldValidator1" ControlToValidate="txtTelefono" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>


<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Nazione" ID="lblNazione"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtNazione"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvNazione" ControlToValidate="txtNazione" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Citta" ID="lblCitta"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtCitta"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvCitta" ControlToValidate="txtCitta" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Via" ID="lblVia"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtVia"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvVia" ControlToValidate="txtVia" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="N° Civico" ID="lblCivico"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtCivico"></asp:TextBox>
  
</div>


<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="CAP" ID="lblCap"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtCap"></asp:TextBox>
    <asp:RequiredFieldValidator  runat="server" ID="rfvCap" ControlToValidate="txtCap" Display="Dynamic" ForeColor="red" ErrorMessage="Campo Obbligatorio"></asp:RequiredFieldValidator>
</div>
</div>
    </div>
    <div id="accordion2">
   
<h3 style="color: wheat" >Indirizzo di fatturazione (* solo se diverso da spedizione):</h3>
    <div>
<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Ragione Sociale" ID="lblRagSoc"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtRagSoc"></asp:TextBox>
  
</div>
<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Sede" ID="lblSede"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtSede"></asp:TextBox>
  
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Via" ID="lblSVia"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtSVia"></asp:TextBox>
  
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="P. IVA" ID="lblIva"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtIva"></asp:TextBox>
  
</div>

<div class="col-lg-push-4">
    <asp:Label ForeColor="whitesmoke" runat="server" Text="Codice Fiscale" ID="lblCF"></asp:Label>
</div>

<div class="col-lg-push-4">
    <asp:TextBox runat="server" ID="txtCF"></asp:TextBox>
  
</div>
</div>
    </div>
<asp:CheckBox runat="server"  BackColor="transparent" id="privacyCheck" CssClass="AcceptedAgreement" /><br/><p style="font-size: small">Dichiaro di aver letto, compreso ed accettato<a href="../Privacy.aspx" target="_blank" id="privacyLink" style="color: lightblue">l'informativa per il trattamento dei dati personali</a></p>
<asp:CustomValidator runat="server" ID="CheckBoxRequired" EnableClientScript="true"   OnServerValidate="CheckBoxRequired_ServerValidate"
  ClientValidationFunction="CheckBoxRequired_ClientValidate">è necessario accettare l'informativa sulla privacy per completare l'ordine.</asp:CustomValidator>
<asp:Button runat="server" ID="CompletaOrdine" OnClick="CompletaOrdine_OnClick" Text="Completa Ordine" OnClientClick="getOrdine();"/>
<div class="row"></div>

    
    <div class="col-lg-4-push" style="font-size: 14px">
    *Le spese di spedizione sono calcolate secondo la seguente tabella: <br/>

    </div>
<div class="col-lg-4-push" style="font-size: 14px">
    
     <b style="color: wheat"> Spedizioni Nazionali (eccetto Sicilia, Calabria e Sardegna): <br/></b>
       - 1 Cartone da 6 Bottiglie      € 9,00 <br/>
       - 2 Cartoni da 6 Bottiglie    € 12,00 <br/>
       - 3 Cartoni da 6 Bottiglie    € 14,00<br/>
       - da 4 a 6 Cartoni da 6 Bottiglie € 19,00<br/>
       - da 7 a 9 Cartoni da 6 Bottiglie  € 24,00<br/>
       - da 10 a 12 Cartoni da 6 Bottiglie € 30,00<br/>
    </div>
    <div class="col-lg-4-push"  style="font-size: 14px; color: wheat;">
    <b>Per spedizioni Estere scrivere a: <br/> <a class="glyphicon glyphicon-envelope" href="mailto:villacorano@tiscali.it"> villacorano@tiscali.it</a><br/></b>
    </div>




<script>
    
    function CheckBoxRequired_ClientValidate(sender, e) {
        e.IsValid = jQuery(".AcceptedAgreement input:checkbox").is(':checked');
    }


    var prezzoCarrello = 0;
    var divTotale = $('#divTotale');
    var prezzoOld = 0;
    var quantitaOld = 0;
    var totCarrello = $('#totCarrello');
    var quantitàCarrello = 0;

    function addBottle(order, id, tipo, prezzo) {
        var prezzoTotale = $('#PrezzoTotale');
        var list = $('#lstCarrello');
        prezzo = prezzo.split('€')[0];
        var totale = prezzo * order;
        list.each(function() {
            $(this).find('li').each(function ()
            {
                if (id == $(this).attr('id')) {
                    var prezzo = $('#Prezzo_' + id).text();
                    var order = parseInt($('#Order_' + id).text());
                    prezzoCarrello = prezzoCarrello - prezzo;
                    quantitàCarrello = quantitàCarrello - order;
                    $(this).remove();
                }
                    
            });
        });
        list.append('<li id="' +
            id +
            '">' +
            id +
            ':' +
            '<span  id="Modify_' +
            id +
            '" class="glyphicon glyphicon-pencil" onclick="Modify(this);">' +
            '</span><span id="Save_' +
            id +
            '" class="glyphicon glyphicon-ok" onclick="Save(this);" style="visibility: hidden">' +
            '</span><span id="Delete_' +
            id +
            '" onclick="Delete(this);" class="glyphicon glyphicon-trash"></span>' +
            '<br/>' +
            '<label>Quantità: </label><label id="Order_' +
            id +
            '">' +
            order +
            '</label >' +
            ' <img src="/Images/16x16.png" alt="N° Bottiglie"/>' +
            '<br/>' +
            '<label>Prezzo: </label><label id="Prezzo_' +
            id +
            '"> ' +
            totale +
            '</label ><label> €</label>' +
            '</li>');

        prezzoCarrello = prezzoCarrello + totale;
        quantitàCarrello = parseInt(quantitàCarrello) + parseInt(order);
     
   
        var spese = CalcoloSpeseSpedizione(quantitàCarrello);
        $('#SpeseSpedizione').text(spese);
        $('#PrezzoTotale').text(prezzoCarrello);
        var totaleOrdine = spese + prezzoCarrello;
        $('#TotaleOrdine').text(totaleOrdine);


    }

  
    $(function () {
        var icons = {
            header: "ui-icon-circle-arrow-e",
            activeHeader: "ui-icon-circle-arrow-s"
        };
        $("#accordion").accordion({
            icons: icons,
            header: "h3",
            collapsible: true
            //active: true
        });

     
        $("#accordion2").accordion({
            icons: icons,
            header: "h3",
            collapsible: true,
            active: false
        });
    });
      

  



    function Modify(type) {
   
        var id = $(type).attr('id').split('Modify_')[1];
        var order = '#Order_' + id;
        var save = '#Save_' + id;
        var prezzo = '#Prezzo_' + id;
        var modify = '#Modify_' + id;
        quantitaOld = parseInt($(order).text());
        $(modify).css('visibility', 'hidden');
        $(save).css('visibility', 'visible');
        $(order).attr('contenteditable', true);
        prezzoOld= $(prezzo).text();
        $(order).focus();
    
    }

    function Save(type) {
        var prezzoTotale = $('#PrezzoTotale');
        var id = $(type).attr('id').split('Save_')[1];
        var prezzo = '#Prezzo_' + id;
        var save = '#Save_' + id;
        var order = '#Order_' + id;
        var newOrder= parseInt($(order).text());
        var modify = '#Modify_' + id;
        $(order).attr('contenteditable', false);
        $(save).css('visibility', 'hidden');
        $(modify).css('visibility', 'visible');
        var p = prezzoBottiglia(id);
        var prezzoNew = newOrder *p ;
        $(prezzo).text(prezzoNew);
        prezzoCarrello = prezzoCarrello + prezzoNew - prezzoOld;
        quantitàCarrello = parseInt(quantitàCarrello) + parseInt(newOrder) - parseInt(quantitaOld);
        
        var spese = CalcoloSpeseSpedizione(quantitàCarrello);
        $('#SpeseSpedizione').text(spese);
        $("#PrezzoTotale").text(prezzoCarrello);
        var totaleOrdine = spese + prezzoCarrello;
        $('#TotaleOrdine').text(totaleOrdine);
    }

    function Delete(type) {
        var id =  $(type).attr('id').split('Delete_')[1];
        var prezzo = $('#Prezzo_' + id).text();
        var order = parseInt($('#Order_' + id).text());
        quantitàCarrello = parseInt(quantitàCarrello) - parseInt(order);
      
        prezzoCarrello = prezzoCarrello - prezzo;
        $('#'+id).remove();
        $('#PrezzoTotale').text(prezzoCarrello);
        var spese = CalcoloSpeseSpedizione(quantitàCarrello);
        $('#SpeseSpedizione').text(spese);
        var totaleOrdine = spese + prezzoCarrello;
        $('#TotaleOrdine').text(totaleOrdine);
    }

    function CalcoloSpeseSpedizione(quantita) {
        var iOrderd = parseInt(quantita);
        if (iOrderd <= 6) {
           return  9;
        }
        else if (iOrderd > 6 && iOrderd <= 12) {
            return 12;
        }
        else if (iOrderd > 12 && iOrderd <= 18) {
            return 14;
        }
        else if (iOrderd > 18 && iOrderd <= 36) {
            return 19;
        }
        else if (iOrderd > 36 && iOrderd <= 54) {
            return 24;
        }
        else if (iOrderd > 54) {
            return 30;
        }
    }
    function prezzoBottiglia(type) {
        var p=0;
        switch (type) {
        case "BiancoPitigliano":
            p = 6;
            break;
        case "Chardonnay":
            p = 12;
            break;
        case "RossoPitigliano":
            p = 9;
            break;
        case "Sauvignon":
            p = 9;
            break;
        case "Alicante":
            p = 12;
            break;
        case "Acheo":
            p = 18;
            break;
        case "Prospero":
            p = 9;
            break;
        case "Gaudium":
            p = 18;
            break;
        case "Iouliatico":
            p = 15;
            break;
        }

        return p;
    }

    function getOrdine() {

        var totale = $('#TotaleOrdine').text();
        $('#<%=hfPrezzo.ClientID%>').val(totale);
        var list = $('#lstCarrello');
        var wineList="";
        list.each(function () {
            $(this)
                .find('li')
                .each(function() {
                    wineList = wineList + $(this).text();
                    if ($(this).text().indexOf('€')) {
                        wineList = wineList + ";";
                    }
                });

        });

        $('#<%=hfOrdine.ClientID%>').val(wineList);

        prezzoCarrello = 0;
        prezzoOld = 0;
        quantitaOld = 0;
        quantitàCarrello = 0;
    }


</script>

