<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="DefaultEnter.aspx.cs" Inherits="VillaCorano._Default" %>
<asp:Content ContentPlaceHolderID="CurrentStyleSheet" runat="server">
    <link href="Content/simple-sidebar.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  

    <div class="jumbotronD">
            
             
        <h1 id="msg" class="fontStyle" style="color: wheat; font-size: 40px" ><img class="img-responsive" style="padding-left: 35%" src="Images/LogoVillacoranoG.png"/>  </h1> 
     
       

 </div>
        <%--    <h2>Getting started</h2>
            <p>
                ASP.NET Web Forms lets you build dynamic websites using a familiar drag-and-drop, event-driven model.
            A design surface and hundreds of controls and components let you rapidly build sophisticated, powerful UI-driven sites with data access.
            </p>
            <p>
                <a class="btn btn-default" href="http://go.microsoft.com/fwlink/?LinkId=301948">Learn more &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Get more libraries</h2>
            <p>
                NuGet is a free Visual Studio extension that makes it easy to add, remove, and update libraries and tools in Visual Studio projects.
            </p>
            <p>
                <a class="btn btn-default" href="http://go.microsoft.com/fwlink/?LinkId=301949">Learn more &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Web Hosting</h2>
            <p>
                You can easily find a web hosting company that offers the right mix of features and price for your applications.
            </p>
            <p>
                <a class="btn btn-default" href="http://go.microsoft.com/fwlink/?LinkId=301950">Learn more &raquo;</a>
            </p>
        </div>--%>
     <script src="Scripts/bootstrap.js"></script>
     <script>
          $(function ()
          {
            
              showText("#msg", "Azienda Vitivinicola Villa Corano Di Stefano Formiconi ", 0, 120);
        });

   </script>
<%--<script>
    $('.toggleHeading1').hide();
    $('.toggleHeading2').hide();
    $('.toggleHeading3').hide();
        var caption = $('.toggleHeading1')
            .addClass('animated fadeInRight')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function () {
                    $(this).removeClass('animated fadeInRight');
                });
        var caption2 = $('.toggleHeading2')
              .addClass('animated fadeInRight')
              .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                  function () {
                      $(this).removeClass('animated fadeInRight');
                  });
        var caption3 = $('.toggleHeading3')
              .addClass('animated fadeInRight')
              .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                  function () {
                      $(this).removeClass('animated fadeInRight');
                  });
        caption.delay(1000).slideToggle();
        caption2.delay(2000).slideToggle();
        caption3.delay(3000).slideToggle();
    </script>--%>
</asp:Content>
