const graphql = require('graphql');
const _ = require('lodash');
const Entry = require('../models/entry');
const Purchase = require('../models/purchase');
const Item = require('../models/item')
const Person = require('../models/person')
const Place = require('../models/place')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
/*
// dummy data
var entrys = [
    { placeId: '1', itemId: '1', personId: '1', quantity: 1, date: "301221", time: "04:05", id:"1"},
    { placeId: '1', itemId: '2', personId: '2', quantity: 2 , date: "311221", time: "04:05" , id:"2"},
    { placeId: '2', itemId: '3', personId: '4', quantity: 2,  date: "010122", time: "04:05", id:"3"},
    { placeId: '3', itemId: '1', personId: '3', quantity: 3 ,  date:"020122", time: "04:05", id:"4"},
    { placeId: '1', itemId: '2', personId: '5', quantity: 3 ,  date: "030122", time: "04:05", id:"5"},
    { placeId: '3', itemId: '3', personId: '6', quantity: 3 , date: "040122", time: "04:05", id:"6"},
];

var purchases = [
    { itemId: '1', quantity: 44,pricePer: 20,id: '1' , date: "301221", time: "04:05", billNumber: 1},
    { itemId: '3', quantity: 42, pricePer: 40,id: '2' , date: "301221", time: "04:05", billNumber: 2},
    { itemId: '2', quantity: 66, pricePer: 30, id: '3' , date: "301221", time: "04:05", billNumber: 100}
];

var items = [
    { name: 'Marble',  unit: "sqft", id: '1' },
    { name: 'Sandstone', unit: "cft", id: '2' },
    { name: 'Iron Bar', unit:"kg",  id: '3' }
];


var places = [
    { name: 'Tiwariganj',id: '1' },
    { name: 'Quserbag', id: '2' },
    { name: 'Vijyant Khand',  id: '3' }
];

var persons = [
    { name: 'Vijay',id: '1' },
    { name: 'Vipin', id: '2' },
    { name: 'Amit',  id: '3' }
];
*/


const EntryType = new GraphQLObjectType({
    name: 'Entry',
    fields: ( ) => ({
        id: { type: GraphQLID },
        quantity: { type: GraphQLInt },
        date: { type: GraphQLString },
        time: {type:GraphQLString},
        item: {
            type: ItemType,
            resolve(parent, args){
                //return _.find(items, { id: parent.itemId });
                return Item.findById(parent.itemId);
            }
        },
        place: {
            type: PlaceType,
            resolve(parent, args){
                return Place.findById(parent.placeId );
                //return _.filter(places, { id: parent.placeId });
            }
        },
        person:{
            type: PersonType,
            resolve(parent, args){
                return Person.findById(parent.personId);
                //return _.filter(persons, { id: parent.personId });
            }
        }

    })
});

const PurchaseType = new GraphQLObjectType({
    name: 'Purchase',
    fields: ( ) => ({
        id: { type: GraphQLID },
        quantity: { type: GraphQLInt },
        pricePer : { type: GraphQLInt },
        billNumber : { type: GraphQLInt },
        date: { type: GraphQLString },
        time: { type:GraphQLString },
        item: {
            type: ItemType,
            resolve(parent, args){
                return Item.find({ _id: parent.itemId });
                //return _.find(items, { id: parent.itemId });
            }
        }
    })
});


const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: ( ) => ({
        unit: { type: GraphQLString },
        name: { type: GraphQLString },
        id: { type: GraphQLID },
        PurchaseData:{
            type: new GraphQLList(PurchaseType),
            resolve(parent, args){
                return Purchase.find({ itemId: parent._id });
                //return _.filter(purchases, { itemId : parent.id });
            }},
        EntryData:{
            type: new GraphQLList(EntryType),
            resolve(parent, args){
                return Entry.find({ itemId: parent._id });
                //return _.filter(purchases, { itemId : parent.id });
            }}
    })
});

const PlaceType = new GraphQLObjectType({
    name: 'Place',
    fields: ( ) => ({
        name: { type: GraphQLString },
        id: { type: GraphQLID },
        thisPlaceEntries:{
            type: new GraphQLList(EntryType),
            resolve(parent, args){
                return Entry.find({ placeId : parent._id});
                //return _.filter(purchases, { itemId : args.itemId });
            }
        }

    })
});


const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: ( ) => ({
        name: { type: GraphQLString },
        id: { type: GraphQLID }

    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        entry: {
            type: EntryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Entry.findById(args.id);
                // code to get data from db / other source
                //return _.find(entrys, { id: args.id });
            }
        },
        purchase: {
            type: PurchaseType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Purchase.findById(args.id);
                //return _.find(purchases, { id: args.id });
            }
        },
        item: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Item.findById(args.id);
                //return _.find(items, { id: args.id });
            }
        },
        place: {
            type: PlaceType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Place.findById(args.id);
                //return _.find(places, { id: args.id });
            }
        },
        person: {
            type: PersonType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Person.findById(args.id);
                //return _.find(persons, { id: args.id });
            }
        },
        purchasesByIteam:{
            type: new GraphQLList(PurchaseType),
            args: {itemId : { type: GraphQLID}},
            resolve(parent, args){
                return Purchase.find({ itemId : args.itemId });
                //return _.filter(purchases, { itemId : args.itemId });
            }
        },
        items:{
            type: new GraphQLList(ItemType),
            resolve(parent, args){
                return Item.find({});
                //return items;
            }
        },
        places:{
            type: new GraphQLList(PlaceType),
            resolve(parent,args){
                return Place.find({});
            }
        },
        persons:{
            type: new GraphQLList(PersonType),
            resolve(parent,args){
                return Person.find({});
            }
        }

    }
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addEntry: {
            type: EntryType,
            args: {
                placeId: { type: new GraphQLNonNull(GraphQLID) },
                itemId: { type: new GraphQLNonNull(GraphQLID) }, 
                personId: { type: new GraphQLNonNull(GraphQLID) },
                quantity: { type: new GraphQLNonNull(GraphQLInt)},
                date: { type: new GraphQLNonNull(GraphQLString) }, 
                time: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let entry = new Entry({
                    placeId: args.placeId,
                    itemId: args.itemId,
                    personId: args.personId,
                    quantity: args.quantity,
                    date: args.date,
                    time: args.time
                });
                return entry.save();
            }
        },

        addPurchase: {
            type: PurchaseType,
            args: {
                itemId: { type: new GraphQLNonNull(GraphQLID) }, 
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
                date: { type: new GraphQLNonNull(GraphQLString) }, 
                time: { type: new GraphQLNonNull(GraphQLString) },
                pricePer: { type: new GraphQLNonNull(GraphQLInt) },
                billNumber: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                let purchase = new Purchase({
                    itemId: args.itemId,
                    quantity: args.quantity,
                    date: args.date,
                    time: args.time,
                    pricePer: args.pricePer,
                    billNumber: args.billNumber
                });
                return purchase.save();
            }
        }, 
        addItem: {
            type: ItemType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                unit: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let item = new Item({
                    name :args.name,
                    unit : args.unit
                });
                return item.save();
            }
        },
        
        addPlace: {
            type: PlaceType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let place = new Place({
                    name :args.name
                });
                return place.save();
            }
        },
        addPerson: {
            type: PersonType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let person = new Person({
                    name :args.name
                });
                return person.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});