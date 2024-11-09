
import { gql } from '@apollo/client';

export const UPDATE_POST = gql`

mutation UpdatePost($id: ID!, $title: String, $body: String) {
  updatePost(id: $id, title: $title, body: $body) {
    id
    title
    body
  }
}
`;