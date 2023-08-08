import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';



// main api function all
const ApiCall =(path, method, body) => {
    return new Promise((resolve, reject) => {

        const options = {
            method:method,
            headers:{
                'Content-Type':'application/json', 
            },
    };
    if (method === 'GET'){

    }else{
        options.body=JSON.stringify(body)
    }
    if (localStorage.getItem('token')){
        options.headers.Authorization =`Bearer ${localStorage.getItem('token')}`;
    }
    fetch(`http://localhost:${BACKEND_PORT}/` + path, options)
    .then((response)=>{
        response.json()
        .then((data)=>{
            if (data.error){
                if (data.error.includes('invalid token')){
                    Error.toast('Please log in again')
                    location.hash='loginin'
                }
                else{
                    Error.toast(data.error);
            }
            return
        }
            return resolve(data);
    
        });
    });
    })
};


// upload newjob
document.getElementById('upload_newjob').addEventListener('click',() =>{
    const createimg = document.querySelector('#createjobimage').files[0];
    const imagefile = Promise.resolve(fileToDataUrl(createimg))
    
    const  tit=document.getElementById("createjobtitle").value
    const  img=document.getElementById("createjobimage").value
    const  sta=document.getElementById("createjobdate").value
    const  des=document.getElementById("createjobdescription").value
    if(tit=='' || img==''  || sta =='' || des==''){
        alert('❌ Please input valid job information')
        return false
    }else{
    imagefile.then(function (result) {
        const imagejob=result
        const payload = {
        title:document.getElementById("createjobtitle").value,
        image:imagejob,
        start:document.getElementById("createjobdate").value,
        description: document.getElementById("createjobdescription").value
    }
    ApiCall('job','POST', payload)
    .then((data) => {
        Right.toast('Post new job successful ✌️✌️✌️')
        lastfeedsend()
    })
    })
}
})

// user profile update
document.getElementById('userinfo').addEventListener('click',() =>{
    const createimg = document.querySelector('#userimage').files[0];
    const userfile = Promise.resolve(fileToDataUrl(createimg))
    userfile.then(function (result) {
    const imageuser=result
    const imageusershow=result
    const nametoupdateprofile=document.querySelector('#pusername')
    const emailtoupdateprofile=document.querySelector('#puseremail')
    const passwordtoupdateprofile=document.querySelector('#puserpassword')

    const userinfomationedit=document.getElementById('userinfomationshow')

    userinfomationedit.textContent=document.getElementById("useremail").value

    nametoupdateprofile.textContent=document.getElementById("username").value
    emailtoupdateprofile.textContent=document.getElementById("useremail").value
    passwordtoupdateprofile.textContent=document.getElementById("userpassword").value

    const  uim=document.getElementById("userimage").value
    const  unm=document.getElementById("username").value
    const  uem=document.getElementById("useremail").value
    const  upw=document.getElementById("userpassword").value
    if(uim=='' || unm ==''  || uem =='' || upw ==''){
        alert('❌ Please input valid user information')
        return false
    }else{
    document.getElementById('puserimg').src=imageusershow
    const payload = {
        email: document.getElementById("useremail").value,
        password: document.getElementById("userpassword").value,
        name: document.getElementById("username").value,
        image: imageuser
    }
    ApiCall('user','PUT', payload)
    .then((data) => {
        Right.toast('Update your profile successful ✌️✌️✌️')
        lastfeedsend()
    })
}
})
})

//search user to focus
document.getElementById('searchwatchuser').addEventListener('click',() =>{

        document.querySelector('#watchsearchuser').addEventListener('click',() =>{
            const searchuseremail=document.getElementById('searchuseremail').value
            const payload ={
                email:searchuseremail,
                turnon: true
            }
                ApiCall('user/watch','PUT',payload).then((data)=>{
                    Right.toast('Focus on user successful ❤️',3000)
                    lastfeedsend();
                })
    });
})

// submit image show on page
document.querySelector('#userimage').addEventListener('change', function(){
            var reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector('#picToCheckuser').src = e.target.result;
            };

            reader.readAsDataURL(this.files[0]);
        }, false);

document.querySelector('#createjobimage').addEventListener('change', function(){
    var reader = new FileReader();
    reader.onload = function (e) {
        document.querySelector('#picToCheckjob').src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
}, false);


// job list model
function joblistshow(list){
    list.forEach(item => {
        const feedDom = document.createElement('div');
        const creatoruserinfocheckdiv=document.createElement('div')
        const creatoruserinfocheckbutton=document.createElement('button')

        const alltoolbuttondiv=document.createElement('div')
        const imgdiv=document.createElement('img')
        const titlebody=document.createElement('div');
        const descriptionbody=document.createElement('div');
        const timediv=document.createElement('div')

        const commentdiv=document.createElement('div')
        const commentsendshow=document.createElement('div')

        const commentshowbardiv=document.createElement('div')
        

        const showmorecommentbutton=document.createElement('button')
        const sendcomment=document.createElement('div')
        const commentbutton=document.createElement('button');
        const sendcommenttext=document.createElement('input')
        const submitcommentbutton=document.createElement('button')
        const cancelcommentbutton=document.createElement('button')

        const likejobbutton=document.createElement('button');
        const deletebutton=document.createElement('button');

        const editjobbutton=document.createElement('button');

        feedDom.id=item.id;
        // feedDom.style.backgroundColor='bisque';  
        feedDom.style.border="3px solid wheat";  
        feedDom.style.width="500px";  
        feedDom.style.height="auto";  
        feedDom.style.marginTop='20px'
        feedDom.style.paddingTop="20px"
        feedDom.className="container col"

        creatoruserinfocheckdiv.appendChild(creatoruserinfocheckbutton)
        creatoruserinfocheckbutton.className='btn btn-sm btn-outline-secondary'
        creatoruserinfocheckbutton.type='button'
        creatoruserinfocheckdiv.style.display='flex'
        creatoruserinfocheckdiv.style.marginBottom='5px'
        creatoruserinfocheckbutton.style.float='left'
        creatoruserinfocheckbutton.id=item.creatorId
        creatoruserinfocheckbutton.textContent="👶 Creator Profile"

        creatoruserinfocheckbutton.addEventListener('click',()=>{
            new bootstrap.Modal(document.getElementById('creatoruserinfo'),{}).show()
            const userspecific=item.creatorId

            ApiCall(`user?userId=`+ userspecific,'GET', {})
            .then((data) =>{
                const watchjoblist=data.jobs
                const watchjobshowincreatoruserinfo = watchjoblist.map(function (watchjoblist) {
                    return `Id:${watchjoblist.id}  Title:${watchjoblist.title}`;
                });
                let watchjoblistnew = watchjobshowincreatoruserinfo.splice(0,3)
                let watchcontent = watchjoblistnew.join('\n')

                if (creatoruserimg.src==undefined || data.image=='styles/nophoto.png'){
                    creatoruserimg.src='styles/nophoto.png'}
                else {
                    creatoruserimg.src=data.image
                }

                let wacthusernum=data.watcheeUserIds
                let countwatchuser=wacthusernum.length 
                creatorusername.textContent=data.name
                creatoruseremail.textContent=data.email
                creatoruserwatchjob.innerText= watchcontent
                creatoruserinfocheckbutton.textContent=`${data.email} 👀`
                if (countwatchuser<=1){
                    creatoruserwatchuser.textContent=`🌹Watch ${countwatchuser} user`}
                    else{
                        creatoruserwatchuser.textContent=`🌹Watch ${countwatchuser} users`}

                
// watch and cancel watch this creator

                var likedislikewactchuserbutton = document.querySelector('#wactchuserbutton');
                var onOff = false;
                likedislikewactchuserbutton.addEventListener('click',() =>{
                    if(onOff){
                        const payload ={
                            email:data.email,
                            turnon: true
                        }
                        ApiCall('user/watch','PUT',payload).then((data)=>{
                            document.querySelector('#wactchuserbutton').style.backgroundColor='red'
                            document.querySelector('#wactchuserbutton').textContent='❤️Watched'
                            creatoruserinfocheckbutton.style.backgroundColor='pink'
                            Right.toast('Focus on user successful ❤️',3000)
                            lastfeedsend();
                            onOff = false
                        })
                    }else{
                        const payload ={
                            email:data.email,
                            turnon: false
                        }
                        ApiCall('user/watch','PUT',payload).then((data)=>{
                            document.querySelector('#wactchuserbutton').textContent='Watch User 👀'
                            document.querySelector('#wactchuserbutton').style.backgroundColor='black'
                            Right.toast('Cancel watch user successful',3000)
                            lastfeedsend();
                            onOff = true
                    })
                    }
                });
            })
        })


        imgdiv.style.border="1px solid wheat"
        imgdiv.src = item.image;
        imgdiv.style.width = '100%';
        imgdiv.style.height = '200px';
        imgdiv.style.marginTop = '5px';

        titlebody.textContent=item.title;
        titlebody.style.backgroundColor='antiquewhite'
        titlebody.style.marginTop='5px'

        descriptionbody.textContent=item.description
        descriptionbody.style.fontSize='5px'
        descriptionbody.style.border='1px solid wheat'
        descriptionbody.style.paddingLeft="5px"
        descriptionbody.style.paddingRight="5px"
        descriptionbody.style.marginTop="10px"
        descriptionbody.style.marginBottom="5px"

        commentdiv.appendChild(commentbutton)
        commentdiv.appendChild(sendcomment)

        sendcomment.style.display='none'

        sendcomment.appendChild(sendcommenttext)
        sendcomment.appendChild(submitcommentbutton)
        sendcomment.appendChild(cancelcommentbutton)

        sendcomment.style.marginTop='5px'
        
        sendcommenttext.placeholder='Input your comment'
        sendcommenttext.className='form-control'
        submitcommentbutton.className='btn btn-success btn-sm'
        submitcommentbutton.type='submit'
        submitcommentbutton.textContent="Submit"
        cancelcommentbutton.className='btn btn-outline-secondary btn-sm'
        cancelcommentbutton.type='button'
        cancelcommentbutton.textContent="Cancel"
        commentbutton.style.marginTop='5px'

        const commentlist=item.comments
        const commentlen=commentlist.length

        commentbutton.className="btn btn-sm btn-outline-secondary"
        commentbutton.textContent=`✒️Add Comment ${commentlen}`

        commentbutton.addEventListener('click',()=>{
            sendcomment.style.display='block'
        
        submitcommentbutton.addEventListener('click',()=>{
            if (sendcommenttext.value!=''){
            const payload={
                id:item.id,
                comment:sendcommenttext.value
            }
            ApiCall('job/comment','POST',payload).then((data)=>{
                Right.toast('Comment job successful ✍️✍️✍️',3000)
                lastfeedsend();
                sendcomment.style.display='none'
        })
            }else{
                Error.toast('Comment cannot empty')
                return false
            }
    })

    cancelcommentbutton.addEventListener('click',()=>{
        sendcomment.style.display='none'
    })
})

// comment show

    commentsendshow.style.border='2px double wheat'
    commentsendshow.style.marginTop='6px'
    commentsendshow.style.fontSize='small'

    commentsendshow.style.display='none'

    showmorecommentbutton.style.width='80px'
    showmorecommentbutton.style.height='30px'
    showmorecommentbutton.style.fontSize='5px'
    showmorecommentbutton.className='btn btn-outline-dark btn-sm'
    showmorecommentbutton.style.display='flex'
    showmorecommentbutton.style.marginTop='5px'
    showmorecommentbutton.style.marginBottom='5px'

    showmorecommentbutton.type='button'
    showmorecommentbutton.style.display='none'



//function of comment bar
function showcommentpagefunction(commentshowshow){
    
        commentshowshow.map(function (commentshowshow) {
            
            const userimageshowcomment=commentshowshow.userId
    
            const commentuserimage=document.createElement('img')
            const commentusertextshow=document.createElement('text')
            const commentusernameshow=document.createElement('a')
            const commentchangeline=document.createElement('br')
    
            commentuserimage.style.width='23px'
            commentuserimage.style.height='23px'
            commentuserimage.type='img'
    
            ApiCall(`user?userId=`+ userimageshowcomment,'GET', {}).then((data)=>{
                let lenimage=data.image

                if (lenimage==undefined){
                    commentuserimage.src='styles/nophoto.png'
                }else{
                    commentuserimage.src=data.image
                }
            })
    
            commentusernameshow.innerText=`${commentshowshow.userEmail} :`
            commentusernameshow.style.marginLeft='5px'
            commentusernameshow.style.marginRight='8px'
            commentusertextshow.textContent=` [ ${commentshowshow.comment} ] `
            commentusernameshow.setAttribute('href','#')
            
    
            commentusernameshow.onclick=function(){
                new bootstrap.Modal(document.getElementById('creatoruserinfo'),{}).show()
                const userspecific=userimageshowcomment
    
                // creatoruserinfoform.style.display='block'
                ApiCall(`user?userId=`+ userspecific,'GET', {})
                .then((data) =>{
                    const watchjoblist=data.jobs
                    const watchjobshowincreatoruserinfo = watchjoblist.map(function (watchjoblist) {
                        return `Id:${watchjoblist.id}  Title:${watchjoblist.title}`;
                    });
                    let watchjoblistnew = watchjobshowincreatoruserinfo.splice(0,3)
                    let watchcontent = watchjoblistnew.join('\n')
    
                    if (creatoruserimg.src==undefined || data.image=='styles/nophoto.png'){
                        creatoruserimg.src='styles/nophoto.png'}
                    else {
                        creatoruserimg.src=data.image
                    }
    
                    let wacthusernum=data.watcheeUserIds
                    let countwatchuser=wacthusernum.length 
                    creatorusername.textContent=data.name
                    creatoruseremail.textContent=data.email
                    creatoruserwatchjob.innerText= watchcontent
                    creatoruserinfocheckbutton.textContent=`${data.email} 👀`
                    if (countwatchuser<=1){
                        creatoruserwatchuser.textContent=`🌹Watch ${countwatchuser} user`}
                        else{
                            creatoruserwatchuser.textContent=`🌹Watch ${countwatchuser} users`}
                            
    // watch and cancel watch COMMENT creator
    
                    var likedislikewactchuserbutton = document.querySelector('#wactchuserbutton');
                    // var onOff = true;
                    likedislikewactchuserbutton.addEventListener('click',() =>{
                        if(onOff){
                            const payload ={
                                email:data.email,
                                turnon: true
                            }
                            ApiCall('user/watch','PUT',payload).then((data)=>{
                                document.querySelector('#wactchuserbutton').style.backgroundColor='red'
                                document.querySelector('#wactchuserbutton').textContent='❤️Watched'
                                creatoruserinfocheckbutton.style.backgroundColor='pink'
                                Right.toast('Focus on user successful ❤️',3000)
                                lastfeedsend();
                                onOff = false
                            })
                        }else{
                            const payload ={
                                email:data.email,
                                turnon: false
                            }
                            ApiCall('user/watch','PUT',payload).then((data)=>{
                                document.querySelector('#wactchuserbutton').textContent='Watch User 👀'
                                document.querySelector('#wactchuserbutton').style.backgroundColor='black'
                                Right.toast('Cancel watch user successful',3000)
                                lastfeedsend();
                                onOff = true
                        })
                        }
                    });
                })
            }
            commentshowbardiv.style.border='2px dotted bisque'
            commentshowbardiv.style.marginTop='3px'
            commentshowbardiv.style.marginBottom='3px'
            commentshowbardiv.appendChild(commentuserimage)
            commentshowbardiv.appendChild(commentusernameshow)
            commentshowbardiv.appendChild(commentusertextshow)
            commentshowbardiv.appendChild(commentchangeline)

            commentshowbardiv.className='align-items-center'
            commentsendshow.style.display='flex'
            commentsendshow.style.justifyContent='space-around'
            commentsendshow.appendChild(commentshowbardiv)

        });
    }

if (commentlist.length==0){
    commentsendshow.style.display='none'
    showmorecommentbutton.style.display='none'
}else if(commentlist.length>4) {
    commentsendshow.style.display='block'
    showmorecommentbutton.style.display='block'
    showmorecommentbutton.textContent=`🌹 More ${commentlist.length-4}`
    let commentlistnewpage = commentlist.slice(-4).reverse()
    showcommentpagefunction(commentlistnewpage)

    showmorecommentbutton.addEventListener('click',()=>{
        let commentlistnewallall= commentlist.reverse()
        showmorecommentbutton.textContent='Hide'
        showcommentpagefunction(commentlistnewallall)
        showmorecommentbutton.style.backgroundColor='wheat'
        Right.toast('Show more comments for you 🐰',1500)
        lastfeedsend()
    })
    }
else {
    commentsendshow.style.display='block'
    let commentlistnewall= commentlist.reverse()
    showcommentpagefunction(commentlistnewall)
    }



// like job
        const getlikes=item.likes
        const sumoflike=getlikes.length
        likejobbutton.className="btn btn-sm btn-outline-secondary"
        likejobbutton.textContent= `Like Job 💗 ${sumoflike}`
        likejobbutton.id='likejobbutton'
        const clicklike=likejobbutton
        let onOff = true
        clicklike.onclick=function(){
            if(onOff){
                const payload ={
                    id:item.id,
                    turnon: true
                }
                ApiCall('job/like','PUT',payload).then((data)=>{
                    onOff = false
                    likejobbutton.style.backgroundColor='pink'
                    likejobbutton.textContent="💗💗💗"
                    Right.toast('Like job successful 💗💗💗',3000)
                    lastfeedsend();
                })   
            }else{
                const payload ={
                    id:item.id,
                    turnon: false
                }
                ApiCall('job/like','PUT',payload).then((data)=>{
                    onOff = true
                    likejobbutton.textContent="💗Like Job"
                    likejobbutton.style.backgroundColor = 'white';
                    Right.toast('Cancel your like successful',3000)
                    lastfeedsend();
                })   
            }
        };

        deletebutton.className="btn btn-sm btn-outline-secondary"
        deletebutton.textContent="❌Delect Job"
        deletebutton.id='deletebutton'
        deletebutton.addEventListener('click', () => {
            const delectjob = document.getElementById(feedDom.id)
            const payload = {
                id: item.id
            }
            if (delectjob.parentNode) {
                delectjob.parentNode.removeChild(delectjob);
        }
            ApiCall('job','DELETE', payload)
            .then((data)=>{
                Right.toast('Delete job successful ✅',3000)
                lastfeedsend();
            })
    })


        editjobbutton.className="btn btn-sm btn-outline-secondary"
        editjobbutton.textContent="✍️Edit Job"
        editjobbutton.id='updatejobbutton'

        editjobbutton.addEventListener('click',()=>{
            new bootstrap.Modal(document.getElementById('jobupdatemodal'),{}).show()

            document.querySelector('#updatejobimage').addEventListener('change', function(){
                var reader = new FileReader();
                reader.onload = function (e) {
                    document.querySelector('#picToCheckjobupdate').src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }, false);

            document.querySelector('#submitupdatebutton').addEventListener('click',()=>{
                    let createimg = document.querySelector('#updatejobimage').files[0];
                    let jobnewfile = Promise.resolve(fileToDataUrl(createimg))
                    jobnewfile.then(function (result) {
                    const jobnewimage=result
                    const payload ={
                        "id": item.id,
                        "title": document.getElementById("updatejobtitle").value,
                        "image": jobnewimage,
                        "start": document.getElementById("updatejobdate").value,
                        "description": document.getElementById("updatejobdescription").value
                    }
                    ApiCall('job','PUT',payload).then((data)=>{
                        Right.toast('Update job successful 😄',3000)
                        lastfeedsend()
                    })
                })
            });    
        }) 

 // time date process
        var timestamp=new Date().getTime();    
        var timesend=item.createdAt.replace('T',' ').replace('Z','')
        timesend = new Date(timesend.replace(/-/g,"/"))
        var mulitipletime =  (timestamp - timesend.getTime())
        if(mulitipletime<86400000){
            var timecreateat=item.createdAt.replace('T',' ').replace('Z','')
            timediv.textContent=timecreateat.substring(0,16)
        }else{
            var timecreateat=item.createdAt.replace('T',' ').replace('Z','')
            timediv.textContent=item.createdAt.substring(0,10)
        }

        timediv.className="text-muted"
        timediv.style.fontSize='4px'
        timediv.style.marginTop='10px'

        alltoolbuttondiv.appendChild(likejobbutton)
        alltoolbuttondiv.appendChild(editjobbutton)
        alltoolbuttondiv.appendChild(deletebutton)

        feedDom.appendChild(imgdiv)
        feedDom.appendChild(titlebody)
        feedDom.appendChild(descriptionbody)
        feedDom.appendChild(creatoruserinfocheckdiv)
        feedDom.appendChild(alltoolbuttondiv)
        feedDom.appendChild(commentdiv)
        commentdiv.appendChild(commentsendshow)
        commentdiv.appendChild(showmorecommentbutton)
        feedDom.appendChild(timediv)
        document.getElementById('feed-item').appendChild(feedDom); 
    })
}


// joblist api
const lastfeedsend = () =>{
    ApiCall('job/feed?start=0','GET', {})
    .then((data) =>{
        document.getElementById('feed-item').textContent='';
        joblistshow(data)
        Right.toast('The page has been updated 😊',1500)

        let countfeedjob=data.length
        if (countfeedjob==0){
            const feedpageblankshow=document.createElement('div')
            const feedpageblankimgdiv=document.createElement('img')
            feedpageblankshow.appendChild(feedpageblankimgdiv)
            feedpageblankshow.style.width='100%'
            feedpageblankimgdiv.style.height='100%'
            feedpageblankimgdiv.type='img'
            feedpageblankimgdiv.src='styles/blank-paper.png'
            feedpageblankimgdiv.style.width='150px'
            feedpageblankimgdiv.style.height='150px'
            document.getElementById('feed-item').appendChild(feedpageblankshow); 
        }
        setTimeout(() => {disloading();}, 1000);
})
}



const settoken = (token)=>{
    localStorage.setItem('token',token)
    showjobfeedPage()
    lastfeedsend();
}


function watchwatch(useremail){
    var watchmyself = document.querySelector('#watchmyselfbutton');
    var onOff = true;
    watchmyself.onclick = function (){
        if(onOff){
            const payload ={
                email:useremail,
                turnon: true
            }
            ApiCall('user/watch','PUT',payload).then((data)=>{
                document.querySelector('#watchmyselfbutton').style.backgroundColor='red'
                document.querySelector('#watchmyselfbutton').textContent='❤️Watched'
                Right.toast('Focus on myself successful ❤️',3000)
                lastfeedsend();
                onOff = false
            })
        }else{
            const payload ={
                email:useremail,
                turnon: false
            }
            ApiCall('user/watch','PUT',payload).then((data)=>{
                document.querySelector('#watchmyselfbutton').textContent='Watch Myself 👀'
                document.querySelector('#watchmyselfbutton').style.backgroundColor='green'
                Right.toast('Cancel watch myself successful',3000)
                onOff = true
                lastfeedsend();
        })
        }
        };
    }


// signinbutton api
document.getElementById('signinbutton').addEventListener('click',()=> {
    lastfeedsend();
    const userpasswordpro=document.getElementById('puserpassword')
    const suserinfomation=document.getElementById('userinfomationshow')
    const usernamepro=document.getElementById('pusername')
    const useremailpro=document.getElementById('puseremail')
    suserinfomation.textContent=document.getElementById("sfloatingInput").value

    usernamepro.textContent=document.getElementById('sfloatingInputName').value
    userpasswordpro.textContent=document.getElementById('sfloatingPassword').value
    useremailpro.textContent=document.getElementById('sfloatingInput').value
    if (document.getElementById('sfloatingPasswordcheck').value===document.getElementById('sfloatingPassword').value){
        
    const payload ={
        email:document.getElementById("sfloatingInput").value,
        password:document.getElementById('sfloatingPassword').value,
        name:document.getElementById('sfloatingInputName').value,
    }
    ApiCall('auth/register', 'POST', payload)
        .then((data) =>{
        Right.toast(`Welcome to lurkforwork.com ${document.getElementById("sfloatingInput").value} 👏👏👏`,3000)
        settoken(data.token);
        watchwatch(document.getElementById("sfloatingInput").value)

    })
    }else{
        Error.toast("🙅‍♂️ Please confirm valid password",2500);
        return false;
    }
})

// loginbutton api
document.getElementById('loginbutton').addEventListener('click',()=> {
    lastfeedsend();
    const userinfomation=document.getElementById('userinfomationshow')

    userinfomation.textContent=document.getElementById("gfloatingInput").value
    userinfomation.value=document.getElementById("gfloatingInput").value

    document.getElementById('puseremail').textContent=document.getElementById("gfloatingInput").value
    document.getElementById('puserpassword').textContent=document.getElementById('gfloatingPassword').value
    const payload ={
        email:document.getElementById("gfloatingInput").value,
        password:document.getElementById('gfloatingPassword').value,
    }
    ApiCall('auth/login', 'POST', payload)
        .then((data)=>{
        Right.toast(`Welcome to lurkforwork.com ${document.getElementById("gfloatingInput").value}👏👏👏`,3000)
        settoken(data.token);
        watchwatch(document.getElementById("gfloatingInput").value)


        const userspecific=data.userId
        ApiCall(`user?userId=`+ userspecific,'GET', {})
        .then((data) =>{
            document.getElementById('puserimg').src=data.image
            document.getElementById('pusername').textContent=data.name
        })
    })
})



// feedpage logout
document.getElementById('logout').addEventListener('click', ()=>{
    Right.toast('Log Out Successful 😊')
    showLogininPage();
})

// page Infinite scrolling
window.addEventListener("scroll", function () {
    var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (parseInt(scrollTop) + parseInt(clientHeight) >= parseInt(htmlHeight)) {
        showjobfeedPage();
        lastfeedsend();
        }
    })

window.onload=function(){
    setTimeout(() => {disloading();}, 2000);
    getPageChange();
    lastfeedsend();
}

// Main enter feedpage function
if(localStorage.getItem('token')){
    showjobfeedPage();
}
