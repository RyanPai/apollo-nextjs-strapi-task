export const resolvers = {
  Query: {
    viewer(_parent, _args, _context, _info) {
      return { id: 1, name: 'John Smith', status: 'cached' }
    },
    todos: async (_parent, _args, _context, _info) => {
      return {
        data: [],
        meta: {pagination: {}}
      }
    }
  }
}

/* Todo */
