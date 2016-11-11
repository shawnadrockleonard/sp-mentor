
namespace mentor {
    export class MentorKnockoutModel  {

        mentorUserId = ko.observable(0);
        mentorTitle = ko.observable().extend({ required: true });
        mentorBio = ko.observable().extend({ required: true });
        mentorName = ko.observable().extend({ required: true });
        optionCareer = ko.observable(false);
        optionTechnical = ko.observable(false);
        optionPresentation = ko.observable(false);
        mentorSkillsTechnical = ko.observable();
        mentorSkillsProfessional = ko.observable();
        mentorComments = ko.observable();

        mentorCareer = ko.observable(new OptionVM()).extend({ required: true });
        mentorCareerAvailable = ko.observable(new Array<OptionVM>());
        mentorCareerText = ko.observable();
        mentorCommunity = ko.observable(new Array<OptionVM>());
        mentorCommunityAvailable = ko.observable(new Array<OptionVM>());
        mentorCommunityText = ko.observable();
        mentorCountry = ko.observable(new OptionVM());
        mentorCountryAvailable = ko.observable(new Array<OptionVM>());
        mentorCountryText = ko.observable();

        errors: KnockoutValidationErrors;

        constructor() {
        }
    }

    export class OptionVM {
        Value: number;
        Text: string;

        constructor() {

        }
    }

    export class UserWithSkillsModel {

        UserId: number;
        IdentityObjectId: number;
        DisplayName: string;
        UserBio: string;
        CareerOptions: string;
        HasRelationships: boolean;
        EstablishedDate: Date;
        SuggestedOutcome: string;

        constructor() {

        }
    }
}