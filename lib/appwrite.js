import { Client, Account ,Databases, ID, Query} from "appwrite";
const client = new Client();
client.setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject('698b2fb9001ae3002d3a');
      //services
export const account =new Account(client);
export const databases = new Databases(client);
export{ ID,Query };

export const DATABASE_ID ='698b65e90037e4f375e5';
export const COLLECTION = {
  users:'users',
  posts: 'posts',
  comments: 'comments'
}