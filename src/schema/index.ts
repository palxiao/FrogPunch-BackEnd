const { gql } = require('apollo-server-express')
// const requireText = require('require-text')
// const queryType = requireText('./query.gql', require)
const queryType = require('./query.ts')
const { Record, Recordql } = require('./record/index.ts')
const { Note, Noteql } = require('./note/index.ts')
const { Target, TargetQL } = require('./target/index.ts')

const typeDefs = gql(Recordql + Noteql + TargetQL + queryType)

const resolvers = {
  Query: {
    ...Record.Query,
    ...Note.Query,
    ...Target.Query
  },
  // Mutation: {},
};

module.exports = {
  typeDefs, resolvers
}

export { }