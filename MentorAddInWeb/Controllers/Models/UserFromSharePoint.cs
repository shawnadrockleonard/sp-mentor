using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Models
{
    public class UserFromSharePoint
    {
        public UserFromSharePoint()
        {
            this.LkupCommunityValue = new List<string>();
        }

        public int UserId { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string IdentityLogin { get; set; }

        public int IdentityLoginId { get; set; }

        public string UserBio { get; set; }

        public bool CareerOptions { get; set; }

        public string LkupCareerValue { get; set; }

        public bool TechnicalOptions { get; set; }

        public string LkupCountryValue { get; set; }

        public List<string> LkupCommunityValue { get; set; }

        public bool PresentationOptions { get; set; }

        public string SkillTechnical { get; set; }

        public string SkillsProfessional { get; set; }

        public string Comments { get; set; }
    }
}