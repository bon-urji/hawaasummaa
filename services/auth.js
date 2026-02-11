import { account,ID } from "../lib/appwrite";
export async function RegisterUser(email, password, name) {
  try {
    const user = await account.create(
      ID.unique(),   // ✅ required
      email,         // ✅ required
      password,      // ✅ required
      name           // optional but good
    );
  console.log('user created successfully:');
    await (email, password);
    return{ success:true, userId : user.$id }
}
catch(error) {
  console.error('Error registering user:', error || error.message);
  return{ success:false,
    error:error.message || 'Registration is failed'
   }
}
}
export async function LoginUser(email,password) {
  try {
    console.log('Loggin',email)
    const session = await account.createEmailPasswordSession(email, password);
     console.log('session is created', session.$id)
     const user = await account.get();
     console.log('Loggin in as', user.email,user.name);
     return{ success:true,
      user: {
        id:user.$id,
        email:user.email,
        name:user.name
      }
     }
  } catch (error) {
     console.error('Error loggin user:', error || error.message);
  return{ success:false,
    error:error.message ||  'loggin is failed.check email/password'
   }
  }
  
}
export async function logoutUser() {
  try {
    await account.deleteSession('current');
    console.log('user logged out successfuly');
    return {success:true};
  } catch (error) {
    console.error('Error logging out user:', error || error.message);
    return { success: false, error: error.message || 'Logout failed' };
  }
}
export async function getCurrentUser(){
  try {
    const user = await account.get();
    console.log('current user:', user.email);
    return { success: true, user: {
      id:user.$id,
      email:user.email,
      name:user.name
    } };
  } catch (error) {
    console.log('No user Logged in')
    return{success:false,
      error:'No user logged in'
    }
  }
}
export async function checAuthStatus () {
  try {
    await account.get();
    return{success:true};
  } catch (error) {
    return{success:false};
  };
};