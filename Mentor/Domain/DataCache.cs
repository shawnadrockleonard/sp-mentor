using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mentor.Domain
{
	public class DataCache
	{
		/// <summary>
		/// Instance member of the data context.  It ensures one and only once instance of the data context is instantiated.
		/// </summary>
		private static DataCache __instance = new DataCache();
		
		/// <summary>
		/// Instance property for the data context used to implement it as a singleton.
		/// </summary>
		public static DataCache Instance
		{
			get { return DataCache.__instance; }
		}
		/// <summary>
		/// Private implementation of the constructor so only the singleton implemnentation can create an instance of the Data Context.
		/// </summary>
		private DataCache() { }

		/// <summary>
		/// List of all the careers avaialble.
		/// </summary>
		public List <Career> Careers { get; set; }

		public List<Country> Countries { get; set; }

		public List<Community> Communities { get; set; }

	}
}
