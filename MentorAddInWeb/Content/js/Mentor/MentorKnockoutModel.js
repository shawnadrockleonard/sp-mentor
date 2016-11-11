var mentor;
(function (mentor) {
    var MentorKnockoutModel = (function () {
        function MentorKnockoutModel() {
            this.mentorUserId = ko.observable(0);
            this.mentorTitle = ko.observable().extend({ required: true });
            this.mentorBio = ko.observable().extend({ required: true });
            this.mentorName = ko.observable().extend({ required: true });
            this.optionCareer = ko.observable(false);
            this.optionTechnical = ko.observable(false);
            this.optionPresentation = ko.observable(false);
            this.mentorSkillsTechnical = ko.observable();
            this.mentorSkillsProfessional = ko.observable();
            this.mentorComments = ko.observable();
            this.mentorCareer = ko.observable(new OptionVM()).extend({ required: true });
            this.mentorCareerAvailable = ko.observable(new Array());
            this.mentorCareerText = ko.observable();
            this.mentorCommunity = ko.observable(new Array());
            this.mentorCommunityAvailable = ko.observable(new Array());
            this.mentorCommunityText = ko.observable();
            this.mentorCountry = ko.observable(new OptionVM());
            this.mentorCountryAvailable = ko.observable(new Array());
            this.mentorCountryText = ko.observable();
        }
        return MentorKnockoutModel;
    }());
    mentor.MentorKnockoutModel = MentorKnockoutModel;
    var OptionVM = (function () {
        function OptionVM() {
        }
        return OptionVM;
    }());
    mentor.OptionVM = OptionVM;
    var UserWithSkillsModel = (function () {
        function UserWithSkillsModel() {
        }
        return UserWithSkillsModel;
    }());
    mentor.UserWithSkillsModel = UserWithSkillsModel;
})(mentor || (mentor = {}));
//# sourceMappingURL=MentorKnockoutModel.js.map