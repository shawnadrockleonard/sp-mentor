using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mentor.Domain
{
	public class Profile
	{		
		public string Name { get; set; }
		public string Email { get; set; }
		public Career Career { get; set; }
		public string Bio { get; set; }
		public bool IsMentor { get; set;  }
		public MentoringArea MentorArea { get; set; }
		public bool IsMentee { get; set; }
		public MentoringArea MenteeArea { get; set; }
		public List<Community> CommunitiesMembership { get; set; }
		public string TechnicalSkills { get; set; }
		public string PrefessionalSkills { get; set; }
		public string Comments { get; set; }
		public Country Country { get; set; }
		public int? mentorSPProfileID { get; set; }
		public int? menteeSPProfileID { get; set; }
		
	}
}
