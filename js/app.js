//Hints for... JSHints
/*global Em */
/*global DS */
/*global console */
/*global Handlebars */
/*global confirm */

/*
Good Ember example:
 http://jsfiddle.net/dWcUp/171/
*/

var App = Em.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true//,
    //LOG_ACTIVE_GENERATION: true,
    //LOG_TRANSITIONS_INTERNAL: true,
    //LOG_BINDINGS: true
});

App.IndexRoute = Em.Route.extend({
    redirect: function() {
        this.transitionTo('contacts'); //use the transitionTo method to automatically start at the contacts route
    }
});

//routers
App.Router.map(function(){ //map URLs to templates
   this.resource('contacts',{path: '/contacts'}, function(){
       this.resource('contact', {path: 'contact/:contact_id'});
       this.route('contactEdit', {path: 'contact/:contact_id/edit'});
   });
});

App.ContactsRoute = Em.Route.extend({
    model: function(){
        return this.store.find(App.Contact);
    },
    actions: {
        //TODO - this should go on the ContactsContactEdit controller
        save: function(){
            var contact = this.modelFor('contacts.contactEdit');
            contact.save();
            this.transitionTo('contact', contact);
        },
        delete: function(model){
            if(confirm('Are you sure?')){
            model.deleteRecord(App.Contact);
            model.save();
            this.transitionTo('contacts');
            }
        }
    }
});

App.ContactsIndexRoute = Em.Route.extend({
    model: function(){
        return this.store.find(App.Contact);
    },
    actions: {
        createContact: function(){
            debugger;

            //var contact = App.Contact.create({id: App.Contact.FIXTURES.length});

            var contact = this.store.createRecord('contact', {id: App.Contact.FIXTURES.length});
            this.transitionTo('contacts.contactEdit', contact);
        }
    }
});

App.ContactRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});

App.ContactEditRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});

//controllers
App.ContactController = Em.ObjectController.extend({
    actions: {
        //TODO - can get rid of these
        editContact: function (params) {
            debugger;
            var model = this.store.find(App.Contact, params.id);
            this.transitionToRoute('contacts.contactEdit', model);
        } ,
        deleteContact: function (model) {
            //this.store.removeItem(model.contact_id);
            this.transitionToRoute('contacts');
        }
    },
    needs: "contact"
});


//models
//setup the store.  we are using the fixture adapter for testing
//other options exist, including the RESTAdapter
App.ApplicationAdapter = DS.FixtureAdapter.extend();
/*
App.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter.create()
});
*/
App.Contact = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    email: DS.attr('string'),
    fullName: function(){
        var fName = this.get('firstName');
        var lName = this.get('lastName');
        return lName + ', ' + fName;
    }.property('firstName', 'lastName')//computed property
});

//fixture data
App.Contact.FIXTURES = [
  {
    id: 0,
    firstName: 'Paul',
    lastName: 'McCartney',
    email: 'pDiddy43234@contoso.com',
    phone: '555-232-1111'
},{
    id: 1,
    firstName: 'John',
    lastName: 'Lennon',
    email: 'biggerThanJesus@contoso.com',
    phone: '555-232-2222'

    },{
    id: 2,
    firstName: 'Ringo',
    lastName: 'Starr',
    email: 'starr@contoso.com',
    phone: '555-232-3333'
    },{
    id: 3,
    firstName: 'George',
    lastName: 'Harrison',
    email: 'george@contoso.com',
    phone: '555-232-4444'
    }
];


//Helpers
/*Ember.HandleBars.registerBoundHelper('date', function(date){
    return moment(date).format('MMM Do');
});*/

Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});