using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace VillaCorano.Controls
{
    public partial class SimpleSideBar : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        protected void CheckBoxRequired_ServerValidate(object sender, ServerValidateEventArgs e)
        {
            e.IsValid = privacyCheck.Checked;
        }
        protected void CompletaOrdine_OnClick(object sender, EventArgs e)
        {
            try
            {
                string nome = txtNome.Text;
                string cognome = txtCognome.Text;
                string email = txtEmail.Text;
                string numeroTel = txtTelefono.Text;
                string metodoDiPagamento = ddlMetodoDiPagamento.SelectedItem.Text;
                string tot = hfPrezzo.Value;
                string nazione = txtNazione.Text;
                string via = txtVia.Text;
                string cap = txtCap.Text;
                string civico = txtCivico.Text;
                string citta = txtCitta.Text;
                string ragSoc = txtRagSoc.Text;
                bool isFatturazione = !string.IsNullOrEmpty(ragSoc);
                string pIva = txtIva.Text;
                string fVia = txtSVia.Text;
                string sede = txtSede.Text;
                string codiceFiscale = txtCF.Text;
                List<string> ordini= new List<string>();
                if (Page.IsValid)
                {
                    hfOrdine.Value.Split(';').ToList().ForEach(o =>
                    {
                        if (o.Contains("Prezzo"))
                        {
                            var ord =
                                o.Split(new[] {"Prezzo"}, StringSplitOptions.RemoveEmptyEntries)[0].Replace(
                                    "Quantità:", String.Empty);

                            ordini.Add(ord);
                        }
                    });
                    bool sentToHost = MailUtilities.SendOrderToHost(nome, cognome, ordini, metodoDiPagamento, numeroTel,
                        email, nazione,
                        citta,
                        cap, via, civico, tot, isFatturazione, pIva, fVia, ragSoc, codiceFiscale, sede);
                    if (sentToHost)
                    {
                        bool sentToCustomer = MailUtilities.SendOrderToCustomer(nome, cognome, email, ordini,
                            metodoDiPagamento, tot, nazione, via,
                            cap, civico, citta, isFatturazione, ragSoc, pIva, fVia, codiceFiscale, sede);
                        if (sentToCustomer)
                        {
                            string message =
                                "Gentile Ospite, le confermiamo l invio dell ordine. A breve riceverà una email di conferma." +
                                "A presto, Villa Corano";
                            Page.ClientScript.RegisterStartupScript(this.GetType(), "Popup",
                                "ShowPopup('" + message + "');",
                                true);
                        }
                        else
                        {
                            string message = "Gentile Cliente, le confermiamo l invio dell ordine,"
                                             + "Grazie. "
                                             + "A presto, Villa Corano";
                            Page.ClientScript.RegisterStartupScript(this.GetType(), "Popup",
                                "ShowPopup('" + message + "');",
                                true);
                        }

                    }
                    else
                    {
                        throw new Exception();
                    }
                }
            }         
        catch(Exception ex)
            {
                string message =                        
                    "Gentile Cliente, non è stato possibile completare l ordine. La invitiamo a riprovare o a contattarci telefonicamente." +         
                    "Grazie. Villa Corano";
                Page.ClientScript.RegisterStartupScript(this.GetType(), "Popup", "ShowPopup('" + message + "');", true);
            }
        }
    }
}