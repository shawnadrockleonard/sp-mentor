using MentorAddInWeb.Common;
using MentorAddInWeb.Common.Http;
using MentorAddInWeb.Data.Context;
using MentorAddInWeb.Filters;
using MentorAddInWeb.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MentorAddInWeb.ApiControllers
{
    [SharePointApiControllerContextFilter]
    [RoutePrefix("api/mentor")]
    [Authorize]
    public class ApiMentorController : ApiController
    {

        [HttpGet]
        [Route("")]
        async public Task<IHttpActionResult> GetRelationships([FromUri]SPHostedParameters parameters)
        {
            var users = new List<UserWithSkillsModel>();
            var userid = 0;

            var spContext = SharePointApiControllerAcsContextProvider.Current.GetSharePointContext(ControllerContext);
            //var searchName = parameters.searchName;

            using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
            {
                if (clientContext != null)
                {
                    var spuser = clientContext.Web.CurrentUser;
                    clientContext.Load(spuser, l => l.Title, l => l.Id);
                    clientContext.ExecuteQuery();
                    userid = spuser.Id;



                    using (var pfeContext = new PfeContext())
                    {

                        var relationships = await pfeContext.RelationshipEntities.Include(i => i.MentorLookup)
                            .Where(w => w.MenteeLookup.IdentityObjectId == userid).ToListAsync();

                        foreach (var requestItem in relationships)
                        {
                            var mentorLkup = requestItem.MentorLookup;

                            users.Add(new UserWithSkillsModel()
                            {
                                UserId = mentorLkup.Id,
                                IdentityObjectId = mentorLkup.IdentityObjectId,
                                SuggestedOutcome = requestItem.SuggestedOutcome,
                                DisplayName = mentorLkup.DisplayName,
                                EstablishedDate = requestItem.Established
                            });
                        }

                        LogProvider.LogInformation("User has {0} relationships", relationships.Count());
                    }
                }
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("")]
        async public Task<IHttpActionResult> SearchMentors([FromUri]SPHostedParameters parameters, string searchName)
        {
            var users = new List<UserWithSkillsModel>();
            var userId = 0;

            try
            {
                var spContext = SharePointApiControllerAcsContextProvider.Current.GetSharePointContext(ControllerContext);
                //var searchName = parameters.searchName;

                using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
                {
                    if (clientContext != null)
                    {

                        var spuser = clientContext.Web.CurrentUser;
                        clientContext.Load(spuser, l => l.Title, l => l.Id);
                        clientContext.ExecuteQuery();
                        userId = spuser.Id;


                        var splist = clientContext.Web.Lists.GetByTitle("yMentors");
                        clientContext.Load(splist, l => l.Title, l => l.RootFolder);
                        clientContext.ExecuteQuery();

                        var xmlQuery = @"
<Where>
    <And>
        <Neq><FieldRef Name='MentorName' LookupId='TRUE' /><Value Type='User'>{1}</Value></Neq>
        <Or>
            <Or>
                <Contains><FieldRef Name='MentorName' /><Value Type='User'>{0}</Value></Contains>
                <Contains><FieldRef Name='MentorLkupCareer' /><Value Type='Lookup'>{0}</Value></Contains>
            </Or>
            <Contains><FieldRef Name='MentorSkillsTechnical' /><Value Type='Text'>{0}</Value></Contains>
        </Or>
    </And>
</Where>";

                        ListItemCollectionPosition ListItemCollectionPosition = null;
                        var camlQuery = CamlQuery.CreateAllItemsQuery();
                        camlQuery.ViewXml = "<View><Query>";
                        camlQuery.ViewXml += string.Format(xmlQuery, searchName, userId);
                        camlQuery.ViewXml += "<ViewFields><FieldRef Name='MentorName'/><FieldRef Name='MentorBio'/><FieldRef Name='MentorLkupCareer'/></ViewFields>";
                        camlQuery.ViewXml += "<RowLimit>50</RowLimit>";
                        camlQuery.ViewXml += "</Query></View>";
                        camlQuery.ListItemCollectionPosition = ListItemCollectionPosition;

                        var splistitems = splist.GetItems(camlQuery);
                        clientContext.Load(splistitems);
                        clientContext.ExecuteQuery();

                        foreach (var requestItem in splistitems)
                        {
                            var displayName = RetrieveListItemUserValue(requestItem, "MentorName");
                            var bio = RetrieveListItemValue(requestItem, "MentorBio");
                            var career = RetrieveListItemLookupValue(requestItem, "MentorLkupCareer");

                            users.Add(new UserWithSkillsModel()
                            {
                                UserId = requestItem.Id,
                                IdentityObjectId = displayName.LookupId,
                                DisplayName = displayName.LookupValue,
                                UserBio = bio,
                                CareerOptions = career.LookupValue
                            });
                        }
                    }
                }


                using (var pfeContext = new PfeContext())
                {
                    var profiles = await pfeContext.UserEntities.Where(w => w.DisplayName.Contains(searchName)).ToListAsync();
                    var relationships = await pfeContext.RelationshipEntities.Where(w => w.MentorLookup.DisplayName.Contains(searchName)).ToListAsync();

                    LogProvider.LogInformation("User found {0}", profiles.Count());
                    LogProvider.LogInformation("User has {0} relaitonships", relationships.Count());
                }
            }
            catch (Exception ex)
            {
                LogProvider.LogError(ex, "failed to query mentor list for {0}", searchName);
                return BadRequest(ex.Message);
            }

            return Ok(users);
        }

        [HttpPost]
        [Route("insert")]
        async public Task<IHttpActionResult> AddMentor([FromUri]SPHostedParameters parameters, [FromBody]UserMentorSubmissionModel model)
        {
            var userid = 0;
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var spContext = SharePointApiControllerAcsContextProvider.Current.GetSharePointContext(ControllerContext);
                //var searchName = parameters.searchName;

                using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
                {
                    if (clientContext != null)
                    {
                        var spuser = clientContext.Web.CurrentUser;
                        clientContext.Load(spuser, l => l.Title, l => l.Id, l => l.LoginName, l => l.Email);
                        clientContext.ExecuteQuery();
                        userid = spuser.Id;
                        var userInList = GetUserById(clientContext, userid);


                        var mentorInList = GetUserById(clientContext, model.mentorId);
                        var mentorUser = clientContext.Web.GetUserById(mentorInList.IdentityLoginId);
                        clientContext.Load(mentorUser, l => l.Title, l => l.Id, l => l.LoginName, l => l.Email);
                        clientContext.ExecuteQuery();


                        using (var pfeContext = new PfeContext())
                        {

                            var currentProfile = await pfeContext.UserEntities.FirstOrDefaultAsync(w => w.IdentityObjectId == userid);
                            if (currentProfile == null)
                            {
                                // new up
                                currentProfile = new Data.Entities.ProfileEntity()
                                {
                                    DisplayName = spuser.Title,
                                    Email = spuser.Email,
                                    IdentityObjectId = spuser.Id,
                                    IdentityLogin = spuser.LoginName
                                };
                                pfeContext.UserEntities.Add(currentProfile);
                            }

                            var mentorProfile = await pfeContext.UserEntities.FirstOrDefaultAsync(f => f.IdentityObjectId == model.mentorId);
                            if (mentorProfile == null)
                            {
                                // new up
                                mentorProfile = new Data.Entities.ProfileEntity()
                                {
                                    DisplayName = mentorUser.Title,
                                    Email = mentorUser.Email,
                                    Id = mentorUser.Id,
                                    IdentityLogin = mentorUser.LoginName,
                                    IdentityObjectId = mentorUser.Id
                                };
                                pfeContext.UserEntities.Add(mentorProfile);
                            }

                            var mentorRelationships = new Data.Entities.ProfileRelationshipEntity()
                            {
                                MenteeLookup = currentProfile,
                                MentorLookup = mentorProfile,
                                Established = DateTime.Now,
                                SuggestedOutcome = model.comments ?? "This demo is awesome"
                            };
                            pfeContext.RelationshipEntities.Add(mentorRelationships);


                            var totalRows = pfeContext.SaveChanges();

                            LogProvider.LogInformation("Saving profile and relationships for {0} with total commit rows:{1}", userid, totalRows);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogProvider.LogError(ex, "Failed to save relatonships {0}", model.mentorId);
                return BadRequest(string.Format("Failed to save relationships for mentor {0}", model.mentorId));
            }

            return Ok("Successfully saved relationships.");
        }

        private UserFromSharePoint GetUserById(ClientContext clientContext, int mentorId)
        {
            var users = new List<UserFromSharePoint>();
            var splist = clientContext.Web.Lists.GetByTitle("yMentors");
            clientContext.Load(splist, l => l.Title, l => l.RootFolder);
            clientContext.ExecuteQuery();

            ListItemCollectionPosition ListItemCollectionPosition = null;
            var camlQuery = CamlQuery.CreateAllItemsQuery();
            camlQuery.ViewXml = "<View><Query>";
            camlQuery.ViewXml += string.Format("<Where><Eq><FieldRef Name='MentorName' LookupId='TRUE' /><Value Type='User'>{0}</Value></Eq></Where>", mentorId);
            camlQuery.ViewXml += @"<ViewFields>
<FieldRef Name='MentorName'/>
<FieldRef Name='MentorBio'/>
<FieldRef Name='MentorCareer'/>
<FieldRef Name='MentorTechnical'/>
<FieldRef Name='MentorPresentation'/>
<FieldRef Name='MentorSkillsTechnical'/>
<FieldRef Name='MentorSkillsProfessional'/>
<FieldRef Name='MentorComments'/>
<FieldRef Name='MentorLkupCareer'/>
<FieldRef Name='MentorLkupCommunity'/>
<FieldRef Name='MentorLkupCountry'/>
</ViewFields>";
            camlQuery.ViewXml += "<RowLimit>1</RowLimit>";
            camlQuery.ViewXml += "</Query></View>";
            camlQuery.ListItemCollectionPosition = ListItemCollectionPosition;

            var splistitems = splist.GetItems(camlQuery);
            clientContext.Load(splistitems);
            clientContext.ExecuteQuery();

            foreach (var requestItem in splistitems)
            {
                var displayName = RetrieveListItemUserValue(requestItem, "MentorName");
                var bio = RetrieveListItemValue(requestItem, "MentorBio");
                var career = RetrieveListItemLookupValue(requestItem, "MentorLkupCareer");
                var country = RetrieveListItemLookupValue(requestItem, "MentorLkupCountry");
                var community = RetrieveListMultiLookupValue(requestItem, "MentorLkupCommunity");
                var boolTechnical = RetrieveListItemAsBoolValue(requestItem, "MentorTechnical");
                var boolPresentation = RetrieveListItemAsBoolValue(requestItem, "MentorPresentation");
                var boolCareer = RetrieveListItemAsBoolValue(requestItem, "MentorCareer");
                var comments = RetrieveListItemValue(requestItem, "MentorComments");
                var skillsTechnical = RetrieveListItemValue(requestItem, "MentorSkillsTechnical");
                var skillsProfessional = RetrieveListItemValue(requestItem, "MentorSkillsProfessional");

                users.Add(new UserFromSharePoint()
                {
                    UserId = requestItem.Id,
                    DisplayName = displayName.LookupValue,
                    IdentityLoginId = displayName.LookupId,
                    IdentityLogin = displayName.LookupId.ToString(),
                    UserBio = bio,
                    CareerOptions = boolCareer,
                    TechnicalOptions = boolTechnical,
                    PresentationOptions = boolPresentation,
                    SkillsProfessional = skillsProfessional,
                    SkillTechnical = skillsTechnical,
                    Comments = comments,
                    LkupCareerValue = career.LookupValue,
                    LkupCountryValue = country.LookupValue,
                    LkupCommunityValue = community.Select(s => s.LookupValue).ToList(),
                    Email = displayName.Email
                });
            }

            return users.FirstOrDefault();
        }

        [HttpPost]
        [Route("remove")]
        async public Task<IHttpActionResult> RemoveMentor([FromUri]SPHostedParameters parameters, [FromBody]UserMentorSubmissionModel model)
        {
            var userid = 0;

            try
            {
                var spContext = SharePointApiControllerAcsContextProvider.Current.GetSharePointContext(ControllerContext);
                //var searchName = parameters.searchName;

                using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
                {
                    if (clientContext != null)
                    {
                        var spuser = clientContext.Web.CurrentUser;
                        clientContext.Load(spuser, l => l.Title, l => l.Id, l => l.LoginName, l => l.Email);
                        clientContext.ExecuteQuery();
                        userid = spuser.Id;
                        var userInList = GetUserById(clientContext, userid);



                        var mentorInList = GetUserById(clientContext, model.mentorId);
                        var mentorUser = clientContext.Web.GetUserById(mentorInList.IdentityLoginId);
                        clientContext.Load(mentorUser, l => l.Title, l => l.Id, l => l.LoginName, l => l.Email);
                        clientContext.ExecuteQuery();


                        using (var pfeContext = new PfeContext())
                        {

                            var currentProfile = await pfeContext.UserEntities.FirstOrDefaultAsync(w => w.IdentityObjectId == userid);
                            var mentorProfile = await pfeContext.UserEntities.FirstOrDefaultAsync(f => f.IdentityObjectId == model.mentorId);
                            var currentRelationship = await pfeContext.RelationshipEntities
                                .FirstOrDefaultAsync(w => w.MenteeId == currentProfile.Id && w.MentorId == mentorProfile.Id);
                            if (currentRelationship != null)
                            {
                                pfeContext.RelationshipEntities.Remove(currentRelationship);
                            }

                            var totalRows = pfeContext.SaveChanges();

                            LogProvider.LogInformation("Saving profile and removing relationships for {0} with total commit rows:{1}", userid, totalRows);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogProvider.LogError(ex, "Failed to save relatonships {0}", model.mentorId);
                return BadRequest(string.Format("Failed to remove relationship for {0}", model.mentorId));
            }

            return Ok("successfully removed relationships, if they existed");
        }


        /// <summary>
        /// Grabs the column value and if populated returns the FieldUserValue object otherwise null
        /// </summary>
        /// <param name="requestItem"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        private FieldUserValue RetrieveListItemUserValue(ListItem requestItem, string columnName)
        {
            var fieldItemValue = requestItem[columnName];
            if (fieldItemValue != null)
            {
                return (FieldUserValue)fieldItemValue;
            }
            return null;
        }

        /// <summary>
        /// Grabs the column value and if populated returns the FieldLookupValue object otherwise null
        /// </summary>
        /// <param name="requestItem"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        private FieldLookupValue RetrieveListItemLookupValue(ListItem requestItem, string columnName)
        {
            var fieldItemValue = requestItem[columnName];
            if (fieldItemValue != null)
            {
                return (FieldLookupValue)fieldItemValue;
            }
            return null;
        }
        /// <summary>
        /// Grabs the column value and if populated returns the FieldLookupValue object otherwise null
        /// </summary>
        /// <param name="requestItem"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        private FieldLookupValue[] RetrieveListMultiLookupValue(ListItem requestItem, string columnName)
        {
            var fieldItemValue = requestItem[columnName];
            if (fieldItemValue != null)
            {
                var fieldReturns = fieldItemValue as FieldLookupValue[];
                return fieldReturns;
            }
            return null;
        }

        private string RetrieveListItemValue(ListItem requestItem, string columnName)
        {
            var fieldItemValue = requestItem[columnName];
            if (fieldItemValue != null)
            {
                return (string)fieldItemValue;
            }
            return string.Empty;
        }

        private bool RetrieveListItemAsBoolValue(ListItem requestItem, string columnName)
        {
            var fieldItemValue = requestItem[columnName];
            if (fieldItemValue != null)
            {

                return bool.Parse(fieldItemValue.ToString());
            }
            return false;
        }
    }
}
