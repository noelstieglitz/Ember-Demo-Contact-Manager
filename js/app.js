//Hints for... JSHints
/*global Em */
/*global DS */
/*global console */
/*global Handlebars */
/*global confirm */

/*
Good Ember example:
 Nested routes: http://jsfiddle.net/dWcUp/171/
 CRUD Example: http://www.embersherpa.com/articles/crud-example-app-without-ember-data/

 Great blog example vid (source code in links) https://www.youtube.com/watch?v=Ga99hMi7wfY

Helpful websites:
 http://www.embersherpa.com/

*/

var App = Em.Application.create({
    LOG_TRANSITIONS: true//,
    //LOG_VIEW_LOOKUPS: true,
    //LOG_ACTIVE_GENERATION: true,
    //LOG_TRANSITIONS_INTERNAL: true,
    //LOG_BINDINGS: true
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
/*
App.ContactRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});

App.ContactsEditRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});
*/
App.ContactsNewRoute = Em.Route.extend({
    model: function(){
        return {id: 0, firstName: '', lastName: '', email: '', phone:'', birthDate:''};
    }
});

//controllers
App.ContactController = Em.ObjectController.extend({
    needs: "contact",
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
    },
    formattedDate: function() {
        var date = this.get('birthDate');

        if(date)
            return moment(date).format('MM-DD-YYYY');

        return null;

    }.property('birthDate')
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
    email: 'biggerThanJesus@contoso.com',
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
