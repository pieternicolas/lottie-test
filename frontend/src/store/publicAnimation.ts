import { gql } from '@apollo/client';

export type PublicAnimation = {
  cursor: string;
  node: {
    jsonUrl: string;
    gifUrl: string;
    name: string;
  };
};

export type PublicAnimationsQuery = {
  featuredPublicAnimations: {
    edges: PublicAnimation[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
      startCursor: string;
      hasPreviousPage: boolean;
    };
    totalCount: number;
  };
};

export const getPublicAnimationsQuery = gql`
  query GetPublicAnimations($after: String) {
    featuredPublicAnimations(after: $after, first: 30) {
      edges {
        cursor
        node {
          jsonUrl
          gifUrl
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;
