using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Models
{
    public class UserWithSkillsModel
    {
        public UserWithSkillsModel()
        {
            this.UserMentees = new List<string>();
        }

        public int UserId { get; set; }

        public int IdentityObjectId { get; set; }

        public string DisplayName { get; set; }

        public string UserBio { get; set; }

        public string CareerOptions { get; set; }

        public bool HasRelationships { get; set; }

        public List<string> UserMentees { get; set; }


        public DateTime EstablishedDate { get; set; }

        public string SuggestedOutcome { get; set; }
    }
}