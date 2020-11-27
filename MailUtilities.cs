using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace VillaCorano
{
    public static class MailUtilities
    {

        private static string mailVillaCorano = System.Configuration.ConfigurationManager.AppSettings["MailTo"];
        private static string pwd = System.Configuration.ConfigurationManager.AppSettings["Pwd"];
        private static string host = System.Configuration.ConfigurationManager.AppSettings["Host"];
        private static string iban = System.Configuration.ConfigurationManager.AppSettings["Iban"];
        public static bool SendOrderToCustomer(string nomeCliente, string cognomeCliente,  string mailTo, List<string> listaProdotti,
            string metodoDiPagamento, string totale, string nazione, string via, string cap, string civico, string citta,
            bool isFatturazione, string ragioneSociale, string pIva, string fVia, string codiceFiscale,string sede)
        {
            bool send = false;
            try
            {

                MailMessage message =new MailMessage()
                {
                    From = new MailAddress(mailVillaCorano)

                 };
                SmtpClient client = new SmtpClient
                {
                    Port = 587,
                    Credentials = new System.Net.NetworkCredential(mailVillaCorano, pwd),
                    Host = host,
                    EnableSsl = true
                };
                StringBuilder sb = new StringBuilder();

                sb.Append("Gentile Cliente: " + nomeCliente + " " + cognomeCliente + ", ");
                sb.AppendLine();
                sb.AppendLine("Di seguito i dettagli del suo ordine");
                listaProdotti.ForEach(p=>sb.AppendLine(p +" bottiglie."));
                sb.AppendLine();
                sb.AppendLine("Metodo di pagamento scelto: " + metodoDiPagamento);
                sb.AppendLine("Totale Ordine: " + totale + " €");
                sb.AppendLine("Indirizzo di Spedizione: ");
                sb.AppendLine("Nazione: " + nazione);
                sb.AppendLine("Città: " + citta);
                sb.AppendLine("Via: " + via);
                sb.AppendLine("Civico: " + civico);
                sb.AppendLine("Cap: " + cap);
              
               
                if (metodoDiPagamento.Contains("Bonifico"))
                {
                    sb.AppendLine(
                        "Avete scelto di pagare tramite bonifico bancario di seguito le coordinate a cui potete effettuare il bonifico.");
                    sb.AppendLine();
                    sb.AppendLine("     Intestatario: Stefano Formiconi");
                    sb.AppendLine("     IBAN: " + iban);
                    sb.AppendLine();
                    sb.AppendLine("La preghiamo di mandarci co" +
                                  "nferma non appena effettuato il bonifico così da procedere alla spedizione della merce");
                }

                if (isFatturazione)
                {
                    sb.AppendLine("L'indirizzo di fatturazione indicatoci è:");
                    sb.AppendLine("Ragione Sociale: "+ragioneSociale);
                    sb.AppendLine("Partita Iva: " +pIva);
                    sb.AppendLine("Via: " +fVia);
                    if (!string.IsNullOrEmpty(codiceFiscale))
                    {
                        sb.AppendLine("Codice Fiscale: " + codiceFiscale);
                    }
                    sb.AppendLine("la preghiamo di segnalarci al più presto, eventuali incongurenze.");
                }

                sb.AppendLine();
                sb.AppendLine();
                sb.AppendLine("Lo staff di Villa Corano la ringrazia per averci accordato la sua preferenza");
                sb.AppendLine("A presto!");
                sb.AppendLine();
                sb.AppendLine();
                sb.AppendLine("Contatti: ");
                sb.AppendLine("Tel./Fax: 0564 - 61.44.64");
                sb.AppendLine("Cell.349-50.16.047");
                sb.AppendLine("Indirizzo: S.R 74, Maremmana Ovest  Km. 46,760");
                sb.AppendLine();
                sb.AppendLine();


               
                message.To.Add(new MailAddress(mailTo));
                message.Subject = "Villa Corano: Conferma Ordine!";
                message.Body = sb.ToString();
              
                client.Send(message);
                return send = true;
            }
            catch (Exception ex)
            {

                return send = false;
            }

        }

        public static bool SendOrderToHost(string nomeCliente, string cognomeCliente,
            List<string> listaProdotti, string metodoDiPagamento,string numeroTelefono, string emailCliente,
            string nazione, string citta, string cap, string via, string civico, string prezzoTotale, bool isFatturazione,
            string pIva, string fVia, string ragioneSociale, string codiceFiscale,string sede)
        {
            bool send = false;
            try
            {

                MailMessage message = new MailMessage()
                {
                    From = new MailAddress(mailVillaCorano)

                };
                SmtpClient client = new SmtpClient
                {
                    Port = 587,
                    Credentials = new System.Net.NetworkCredential(mailVillaCorano, pwd),
                    Host = host,
                    EnableSsl = true
                };
                StringBuilder sb = new StringBuilder();

                sb.Append("Nuovo Ordine: ");
                sb.AppendLine();
                sb.AppendLine("Hai ricevuto un nuovo ordine. Di seguito i dettagli:");
                sb.AppendLine("Cliente: " + nomeCliente + " " + cognomeCliente);
                sb.AppendLine("N° Telefono: " + numeroTelefono);
                sb.AppendLine("Email Cliente: " + emailCliente);
                sb.AppendLine();

                sb.AppendLine("Quantità: ");
                listaProdotti.ForEach(p => sb.AppendLine(p + " bottiglie."));
              
                sb.AppendLine("Metodo di pagamento scelto: " + metodoDiPagamento);
                sb.AppendLine();
                sb.AppendLine("Indirizzo di Spedizione:");
                sb.AppendLine("Nazione: " + nazione);
                sb.AppendLine("Città: " + citta);
                sb.AppendLine("Via: " + via);
                sb.AppendLine("N° Civico: " + civico);
                sb.AppendLine("CAP: " + cap);
                if (isFatturazione)
                {
                    sb.AppendLine();
                    sb.AppendLine("Il cliente ha indicato un indirizzo di fatturazione diverso da quello di spedizione.");
                    sb.AppendLine();
                    sb.AppendLine("Di seguito i dettagli: ");
                    sb.AppendLine();
                    sb.AppendLine("Ragione Sociale: " + ragioneSociale);
                    sb.AppendLine("Partita Iva: " + pIva);
                    sb.AppendLine("Sede: " + sede);
                    sb.AppendLine("Via: " + fVia);
                    if (!string.IsNullOrEmpty(codiceFiscale))
                    {
                        sb.AppendLine("Codice Fiscale: " + codiceFiscale);
                    }              
                }

                sb.AppendLine("Costo Totale: " + prezzoTotale + "€");
                sb.AppendLine();
                sb.AppendLine();

                
                message.From = new MailAddress(mailVillaCorano);
                message.To.Add(new MailAddress(mailVillaCorano));
                message.Subject = "Nuovo Ordine!";
                message.Body = sb.ToString();
                
                client.Send(message);
                return send = true;
            }
            catch (Exception ex)
            {

                return send = false;
            }

        }
    }
}