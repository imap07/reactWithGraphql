import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: "http://localhost:8000/graphql/",
  })
  return new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    link: httpLink,
  });
};

export { createApolloClient };
