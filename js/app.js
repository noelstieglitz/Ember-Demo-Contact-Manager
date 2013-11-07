
var App = Em.Application.create({
    LOG_TRANSITIONS: true
});

//routers
App.Router.map(function(){ //map URLs to controllers/templates
   this.resource('contacts',{path: '/'}, function(){
       this.resource('contact', {path: 'contact/:contact_id'});
       this.route('edit', {path: 'contact/:contact_id/edit'});
       this.route('new', {path: 'contact/new'});
   });
});

//define routes
App.ContactsRoute = Em.Route.extend({
    model: function(){
        return this.store.findAll(App.Contact);
    }
});

App.ContactsNewRoute = Em.Route.extend({
    model: function(){
        return {id: 0, firstName: '', lastName: '', email: '', phone:'', birthDate:''};
    }
});

//controllers
App.ContactController = Em.ObjectController.extend({
    actions: {
        edit: function (params) {
            this.transitionToRoute('contacts.edit', params);
        },
        delete: function(model){
            if(confirm('Are you sure?')){
                model.deleteRecord(App.Contact);
                this.transitionToRoute('contacts');
            }
        }
    }
});

App.ContactsNewController = Em.ObjectController.extend({
    actions:{
        save: function(){
            var contact = this.store.createRecord('contact',
                {
                    firstName: this.get('firstName'),
                    lastName: this.get('lastName'),
                    email: this.get('email'),
                    phone: this.get('phone'),
                    birthDate: this.get('birthDate')
                });
            this.transitionToRoute('contact', contact);
        }
    }
});

App.ContactsController = Em.ArrayController.extend({
    sortProperties: ['fullName']
});

App.ContactsEditController = Em.ObjectController.extend({
    actions:{
        save: function(){
            this.get('model').save();
            this.transitionToRoute('contact', this.model);
        }
    }
});
//models

//Use the fixture adapter
App.ApplicationAdapter = DS.FixtureAdapter.extend();


App.Contact = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    email: DS.attr('string'),
    birthDate: DS.attr('date', {defaultValue: null}),
    fullName: function(){
        return this.get('lastName') + ', ' + this.get('firstName');
    }.property('firstName', 'lastName')//computed property
});

//fixture data
App.Contact.FIXTURES = [
  {
    id: 0,
    firstName: 'Paul',
    lastName: 'McCartney',
    email: 'pDiddy43234@contoso.com',
    phone: '555-232-1111',
    birthDate: new Date(1940, 10, 9)
},{
    id: 1,
    firstName: 'John',
    lastName: 'Lennon',
    email: 'biggerThanJ@contoso.com',
    phone: '555-232-2222',
    birthDate: new Date(1941, 10, 9)

    },{
    id: 2,
    firstName: 'Ringo',
    lastName: 'Starr',
    email: 'starr@contoso.com',
    phone: '555-232-3333',
    birthDate: new Date(1942, 10, 9)
    },{
    id: 3,
    firstName: 'George',
    lastName: 'Harrison',
    email: 'george@contoso.com',
    phone: '555-232-4444',
    birthDate: new Date(1943, 10, 9)
    }
];

//Helpers
Em.Handlebars.registerBoundHelper('parseDate', function(date){
    if(moment(date).isValid()){
        return moment(date).fromNow();
    }

    return date;
});


//Handlebars helper to help with debugging
Em.Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});


//Views
App.DatePicker = Em.View.extend({
    tagName: "input",
    attributeBindings: ['data','value','format','readonly','type','size'],
    type: "text",
    format: 'MM-DD-YYYY',
    data:null,
    value: function(){
        var date = this.get('data');

        if(date){
            return moment(date).format(this.get('format'));
        }
        else{
            return "";
        }
    }.property('data'),
    didInsertElement: function(){
        var self = this;

        var onChangeDate = function(ev) {
            self.set('data', ev.date);
        };

        this.$().datepicker().on('changeDate', onChangeDate);
    }
});