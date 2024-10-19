

const socket=io();

// socket.on('count updated',(count)=>{
//     console.log('the count has been updated  '+  count);
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })

//elements
const $messageform=document.querySelector('#message-form')
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $sendlocationbtn=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')
const messagetemplate=document.querySelector('#message-template').innerHTML
const messagelocationtemplate=document.querySelector('#locationmessage-template').innerHTML
const  sidebartemplate=document.querySelector('#sidebar-template').innerHTML


//query

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


const autoscroll=()=>{
    const $newmessage=$messages.lastElementChild
    const $newmessagestyles=getComputedStyle($newmessage)
    const $newmessagemargin=parseInt($newmessagestyles.marginBottom)
    const newmessageheight=$newmessage.offsetHeight+$newmessagemargin
    const visibleheighht=$messages.offsetHeight
    const containerheight=$messages.scrollHeight
    const scrolloffset=$messages.scrollTop+visibleheighht
    if(containerheight-newmessageheight<=scrolloffset)
    {
        $messages.scrollTop=$messages.scrollHeight
    }

}

socket.on('message',(message)=>{
    console.log(message);
    const html=Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationmessage',(message)=>{
    console.log(message);
    const loc=Mustache.render(messagelocationtemplate,{
        username:message.username,
       url:message.url,
       createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',loc)
    autoscroll()
})

$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageformbutton.setAttribute('disabled','disabled')

    //const message=document.querySelector('input').value
    const message=e.target.elements.message.value
    socket.emit('sendmessage',message,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()
        if(error)
        {
            return console.log(error)
        }
        console.log('the message was delivered!');
    })
})

$sendlocationbtn.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('geolocation is not supported by your browser')
    }

    $sendlocationbtn.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendlocationbtn.removeAttribute('disabled')
           console.log('location shared!');
        })
        
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }

})

socket.on('roomdata',({room,users})=>{

    const html=Mustache.render(sidebartemplate,{
       room,
       users
    })
   document.querySelector('#sidebar').innerHTML=html
})