//Hints for... JSHints
/*global Em */
/*global DS */
/*global console */

/*
Good Ember example:
 http://jsfiddle.net/dWcUp/171/
 */

var App = Em.Application.create();

App.IndexRoute = Em.Route.extend({
    redirect: function() {
        this.transitionTo('contacts'); //use the transitionTo method to automatically start at the contacts route
    }
});

//routers
App.Router.map(function(){ //map URLs to templates
   this.resource('contacts',{path: '/contacts'}, function(){
       this.resource('contact', {path: ':contact_id'});
   }); //maps to /#/contacts
    //define all other URLs in application
});

App.ContactsRoute = Em.Route.extend({
    model: function(){
        return this.store.find(App.Contact);
    },
    contactCount: function(){
        debugger;
        return this.model.length;
    }
});

App.ContactRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});
//controllers
App.ContactsController =  Em.ArrayController.extend();
//App.ContactController = Em.ObjectController.extend();

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
    lastName: 'McCarney',
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