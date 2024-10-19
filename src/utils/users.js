const users=[]

//adduser,removeuser,getuser,getuserInroom

 const adduser=({id,username,room})=>{
     
    //clean data
     username=username.trim().toLowerCase()
     room=room.trim().toLowerCase()

     //validate data
     if(!username || !room)
     {
         return{
             error:'username and room required'
         }
     }

     //checking existing user
    const existinguser=users.find((user)=>{
      return user.room===room &&user.username===username
    })


    //validate username
    if(existinguser)
    {
        return{
            error:'username in use'
        }
    }

    //storing user
    const user={id,username,room}
    users.push(user)
    return user

 }


 const removeuser=(id)=>{
     const index=users.findIndex((user)=>user.id==id)

     if(index !==-1)
     {
         return users.splice(index,1)[0]
     }
 }



 const getuser=(id)=>{
    return users.find((user)=>user.id==id)
 }
 
 const getuserInroom=(room)=>{
    room=room.trim().toLowerCase()
     return users.filter((user)=>user.room==room)
 }


//  const userr=adduser({
//      id:22,
//      username:"vvv",
//      room:"cd"
//  })
//  console.log(userr);

 module.exports={
    adduser,removeuser,getuser,getuserInroom

 }