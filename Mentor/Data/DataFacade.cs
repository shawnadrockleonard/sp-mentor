using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mentor.Domain;

namespace Mentor.Data
{
	/// <summary>
	/// Implements a facade pattern for accessing the data.  This should help minimize the changes required if we migrate portions to Azure or Dynamics.
	/// </summary>
	public class DataFacade
	{
		private static DataFacade __instance = new DataFacade();

		public static DataFacade Instance
		{
			get { return DataFacade.__instance; }
		}

		SharePointOnlineAdapter _spoAdapter = default(SharePointOnlineAdapter);

		private DataFacade()
		{		
			_spoAdapter = new SharePointOnlineAdapter();
		}

		public List<Career> GetCareers()
		{
			///TODO: Replace with code to read from SPO
			// return _spoAdapter.GetCareers();
			List<Career> careers = new List<Career>();
			for (int i = 1; i<= 20; i++)
			{
				careers.Add(new Career() { ID = i, CareerName = string.Format(@"Career {0}", i) });
			}

			return careers;			
		}

		public List<Community> GetCommunities()
		{
			///TODO: Replace with code to read from SPO			
			List<Community> communities = new List<Community>();
			for (int i = 1; i <= 20; i++)
			{
				communities.Add(new Community() { ID = i, CommunityName = string.Format(@"Community {0}", i) });
			}

			return communities;
		}

		public List<Country> GetCountries()
		{
			///TODO: Replace with code to read from SPO			
			List<Country> countries = new List<Country>();
			for (int i = 1; i <= 20; i++)
			{
				countries.Add(new Country() { ID = i, CountryName = string.Format(@"Country {0}", i) });
			}

			return countries;
		}


	}
}
