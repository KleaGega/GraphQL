import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
 query GetComments($userId: ID!) {
    comments(userId: $userId) {
        id
        name
        email
        body
    }
}

`;
