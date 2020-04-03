const express = require('express');
const bodyParser = require('body-parser');
const graphqlHtpp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');


const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql',
    graphqlHtpp({
        // schema
        schema: buildSchema(`
        type Event {
            _id: ID!,
            title: String!
            Desc: String!
            prices: Float!
            date: String!
        }

        input EventInput {
            title: String!
            desc: String!
            prices: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type mutationQuery {
            createEvent(EventInput: EventInput): Event
        }
        schema {
            query : RootQuery
            mutation : mutationQuery
        }
        `),
        // resolver
        rootValue: {
            events: ()=>{
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.EventInput.title,
                    desc: args.EventInput.desc,
                    prices: +args.EventInput.prices,
                    date: args.EventInput.date
                }
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })    
);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:
    ${process.env.MONGO_PASSWORD}
    @cookbook-x4jfg.mongodb.net/test?retryWrites=true&w=majority`
    ).then(() => {
        app.listen(3300);
    }).catch(err => {
        console.log(err)
    })
