using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Entities
{
    /// <summary>
    /// Contains the User Profile for the Mentor/Mentee user
    /// </summary>
    [Table("uProfile", Schema = "dbo")]
    public class ProfileEntity
    {
        public ProfileEntity()
        {
            this.MyMentors = new HashSet<ProfileRelationshipEntity>();
            this.MyMentees = new HashSet<ProfileRelationshipEntity>();
        }

        /// <summary>
        /// primary key
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// identity provider unique id
        /// </summary>
        public int IdentityObjectId { get; set; }

        /// <summary>
        /// full claim identity
        /// </summary>
        [Required()]
        [StringLength(255)]
        [Index(IsUnique = true)]
        public string IdentityLogin { get; set; }

        /// <summary>
        /// display name of the user
        /// </summary>
        [StringLength(255)]
        public string DisplayName { get; set; }

        /// <summary>
        /// email of the user
        /// </summary>
        [StringLength(255)]
        public string Email { get; set; }

        /// <summary>
        /// first name of the user
        /// </summary>
        [StringLength(255)]
        public string FirstName { get; set; }

        /// <summary>
        /// last name of the user
        /// </summary>
        [StringLength(255)]
        public string LastName { get; set; }

        /// <summary>
        /// Retreive the users mentors
        /// </summary>
        public virtual HashSet<ProfileRelationshipEntity> MyMentors { get; private set; }

        /// <summary>
        /// Retrieve the users mentees
        /// </summary>
        public virtual HashSet<ProfileRelationshipEntity> MyMentees { get; private set; }
    }
}