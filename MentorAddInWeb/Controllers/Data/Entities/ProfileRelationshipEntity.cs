using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Entities
{
    /// <summary>
    /// Contains the relationship the Mentor/Mentee user
    /// </summary>
    [Table("uProfileRelationship", Schema = "dbo")]
    public class ProfileRelationshipEntity
    {

        /// <summary>
        /// Mentor foreign key
        /// </summary>
        public int MentorId { get; set; }


        public ProfileEntity MentorLookup { get; set; }

        /// <summary>
        /// Mentee Foreign Key
        /// </summary>
        public int MenteeId { get; set; }


        public ProfileEntity MenteeLookup { get; set; }

        public DateTime Established { get; set; }

        public string SuggestedOutcome { get; set; }
    }
}