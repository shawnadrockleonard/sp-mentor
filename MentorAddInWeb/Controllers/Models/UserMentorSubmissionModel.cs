using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Models
{
    public class UserMentorSubmissionModel
    {
        [Required(ErrorMessage = "You must select a valid Mentor Id")]
        public int mentorId { get; set; }

        public string comments
        {
            get; set;
        }
    }
}