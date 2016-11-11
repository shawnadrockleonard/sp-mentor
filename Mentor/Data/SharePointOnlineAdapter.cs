using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using Mentor.Domain;

namespace Mentor.Data
{
	public class SharePointOnlineAdapter : IDisposable
	{
		const string WEB_URL = @"https://microsoft.sharepoint.com/teams/acto13/communities/mentor/_api/";
		const string CAREERS_REST = @"web/lists/GetByTitle('Careers)";

		public void Dispose()
		{
			
		}
		
		public List<Career> GetCareers()
		{		
			using (HttpClient client = new HttpClient())
			{
				client.BaseAddress = new Uri(WEB_URL);
				using (HttpResponseMessage resp = client.GetAsync(CAREERS_REST).Result)
				{


					string respString = resp.Content.ReadAsStringAsync().Result;
					if (resp.StatusCode != HttpStatusCode.OK)
					{
						throw new Exception(@"Bad");
					}
				}

			}

			return new List<Career>();
		}

		//Possible solution: http://sharepoint.stackexchange.com/questions/113929/make-a-restful-api-call-to-sharepoint-online-from-console-program

		//public static JToken GetList(Uri webUri, ICredentials credentials, string listTitle)
		//{
			
		//	using (var client = new WebClient())
		//	{
		//		client.Headers.Add("X-FORMS_BASED_AUTH_ACCEPTED", "f");
		//		client.Credentials = credentials;
		//		client.Headers.Add(HttpRequestHeader.ContentType, "application/json;odata=verbose");
		//		client.Headers.Add(HttpRequestHeader.Accept, "application/json;odata=verbose");
		//		var endpointUri = new Uri(webUri, string.Format("/_api/web/lists/getbytitle('{0}')", listTitle));
		//		var result = client.DownloadString(endpointUri);
		//		var t = JToken.Parse(result);
		//		return t["d"];
		//	}
		//}

	}

	
}
