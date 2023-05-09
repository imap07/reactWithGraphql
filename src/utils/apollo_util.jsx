export const getQuery = async (apolloClient, query, variables) => {
  const { errors, data } = await apolloClient.query({
    query,
    variables,
    fetchPolicy: "no-cache",
  });
  if (errors) throw new Error(errors[0].message);
  return data;
};

export const getMutation = async (apolloClient, mutation, variables) => {
  const result = await apolloClient.mutate({
    mutation,
    variables    
  });
  return result.data;
};
