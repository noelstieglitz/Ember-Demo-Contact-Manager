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
App.Router.map(function(){ //map URLs to controllers/templates
   this.resource('contacts',{path: '/contacts'}, function(){
       this.resource('contact', {path: 'contact/:contact_id'});
       this.route('edit', {path: 'contact/:contact_id/edit'});
   });
});

App.ContactsRoute = Em.Route.extend({
    model: function(){
        return this.store.findAll(App.Contact);
    },
    actions: {
        createContact: function(){
            var nextId = parseInt(App.Contact.FIXTURES.sort(function(a,b) { return parseInt(a.id) > parseInt(b.id); })[App.Contact.FIXTURES.length-1].id) + 1;
            var contact = this.store.createRecord('contact', {id: nextId});
            this.transitionTo('contacts.edit', contact);
        }
    }
});

App.ContactRoute = Em.Route.extend({
    model: function(params){
        return this.store.find(App.Contact, params.contact_id);
    }
});

//controllers
App.ContactController = Em.ObjectController.extend({
    needs: "contact",
    actions: {
        edit: function (params) {
            var model = this.store.find(App.Contact, params.id);
            this.transitionToRoute('contacts.edit', model);
        },
        delete: function(model){
            if(confirm('Are you sure?')){
                model.deleteRecord(App.Contact);
                this.transitionTo('contacts');
            }
        }
    }
});
App.ContactsEditController = Em.ObjectController.extend({
    actions:{
        save: function(){

            this.transitionTo('contact', this.model);
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