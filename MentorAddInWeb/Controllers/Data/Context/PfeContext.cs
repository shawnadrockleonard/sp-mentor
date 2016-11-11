using MentorAddInWeb.Data.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core.Objects;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    /// <summary>
    /// EF configuration context for code first implementation
    /// </summary>
    [DbConfigurationType(typeof(PfeContextConfiguration))]
    public partial class PfeContext : DbContext, IPfeContext
    {
        public PfeContext()
            : base("DefaultConnection")
        {
            // set the initializer to none
            this.Database.CommandTimeout = 320;
            this.Configuration.ProxyCreationEnabled = false;
            Database.SetInitializer<PfeContext>(new PfeContextInitializer());
        }

        /// <summary>
        /// Represents a Person
        /// </summary>
        public DbSet<ProfileEntity> UserEntities { get; set; }

        /// <summary>
        /// Represents relationships
        /// </summary>
        public DbSet<ProfileRelationshipEntity> RelationshipEntities { get; set; }


        /// <summary>
        /// starts the Fluent configuration of each entity in the database provider
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;

            modelBuilder.Entity<ProfileEntity>().HasKey(k => k.Id);

            modelBuilder.Entity<ProfileRelationshipEntity>().HasKey(k => new { k.MentorId, k.MenteeId });
            modelBuilder.Entity<ProfileRelationshipEntity>().HasRequired(hr => hr.MentorLookup).WithMany(wm => wm.MyMentees).HasForeignKey(fk => fk.MentorId).WillCascadeOnDelete(false);
            modelBuilder.Entity<ProfileRelationshipEntity>().HasRequired(hr => hr.MenteeLookup).WithMany(wm => wm.MyMentors).HasForeignKey(fk => fk.MenteeId).WillCascadeOnDelete(false);

        }


        public override int SaveChanges()
        {
            var result = 0;
            try
            {
                result = base.SaveChanges();
            }
            catch (Exception ex)
            {
                HandleSaveChangesException(ex);
            }
            return result;
        }


        public override async Task<int> SaveChangesAsync()
        {
            var result = 0;
            try
            {
                result = await base.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                HandleSaveChangesException(ex);
            }
            return result;
        }


        public override async Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken)
        {
            var result = 0;
            try
            {
                result = await base.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                HandleSaveChangesException(ex);
            }
            return result;
        }


        private void HandleSaveChangesException(Exception ex)
        {
            if (ex.GetType() == typeof(DbEntityValidationException))
            {
                var validationException = (DbEntityValidationException)ex;
                Trace.TraceError(validationException.ErrorDetails());
                throw new PfeContextException("One or more items failed to save due to validation errors.", validationException);
            }
            else
            {
                Trace.TraceError("An error occurred while saving items");
                throw new Exception(string.Format("An error occurred while saving items: {0}", ex.ToString()));
            }
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        void System.IDisposable.Dispose()
        {
            this.Dispose(true);
        }

    }
}