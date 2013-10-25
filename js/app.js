//Hints for... JSHints
/*global Em */
/*global DS */
/*global console */

/*
Good Ember example:
 http://jsfiddle.net/dWcUp/171/
*/

var App = Em.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_ACTIVE_GENERATION: true
});

App.IndexRoute = Em.Route.extend({
    redirect: function() {
        this.transitionTo('contacts'); //use the transitionTo method to automatically start at the contacts route
    }
});

//routers
/*
App.Router.map(function(){
    this.resource("contacts", { path: "/" }, function() {
        this.route("new", { path: "/new" });
    });

    this.resource("contact", { path: "/:contact_id" }, function() {
        this.route("edit", { path: "/edit" });
    });
});*/


App.Router.map(function(){ //map URLs to templates
   this.resource('contacts',{path: '/contacts'}, function(){
       this.resource('contact', {path: '/:contact_id'}, function(){
           this.route('edit');
           this.route('create');
           this.route('delete');
       });
   });
});

App.ContactsRoute = Em.Route.extend({
    model: function(){
        return this.store.find(App.Contact);
    }
});
App.ContactRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});

App.ContactEditRoute = Em.Route.extend({
    model: function(params){
        debugger;
        return this.store.find(App.Contact, params.contact_id);
    },
    actions: {
        save: function(){
            var newContact = this.modelFor('contact.edit');
            this.transitionTo('contact', newContact);
        }
    },
    renderTemplate: function() {
        this.render('contact.edit', { into: 'contacts' });
}
});


//controllers
App.ContactsController =  Em.ArrayController.extend();
App.ContactController = Em.ObjectController.extend({
    actions: {
        //TODO - we can get rid of these
        editContact: function (model) {
            debugger;
            this.transitionToRoute('contact.edit', model.id);
        } ,
        deleteContact: function (model) {
            //this.store.removeItem(model.contact_id);
            this.transitionToRoute('contacts');
        }
    }
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
    id: 1,
    firstName: 'Paul',
    lastName: 'McCartney',
    email: 'pDiddy43234@contoso.com',
    phone: '555-232-1111'
},{
    id: 2,
    firstName: 'John',
    lastName: 'Lennon',
    email: 'biggerThanJesus@contoso.com',
    phone: '555-232-2222'

    },{
    id: 3,
    firstName: 'Ringo',
    lastName: 'Starr',
    email: 'starr@contoso.com',
    phone: '555-232-3333'
    },{
    id: 4,
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