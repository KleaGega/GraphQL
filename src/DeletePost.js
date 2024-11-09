import { gql } from "@apollo/client";

export const DELETE_POST = gql `
        mutation deletePost ( $id: ID!){
       deletePost(id: $id){
        id
      title
      body
        }
        }

`