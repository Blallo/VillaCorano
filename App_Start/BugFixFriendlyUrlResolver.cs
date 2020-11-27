using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace VillaCorano.App_Start
{
    
        public class BugFixFriendlyUrlResolver : Microsoft.AspNet.FriendlyUrls.Resolvers.WebFormsFriendlyUrlResolver
        {
            protected override bool TrySetMobileMasterPage(HttpContextBase httpContext, Page page, string mobileSuffix)
            {
                return false;
                //return base.TrySetMobileMasterPage(httpContext, page, mobileSuffix);
            }
        }

    
}