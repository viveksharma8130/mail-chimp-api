import * as express from 'express';
import helmet from 'helmet';
import * as cors from 'cors';
import * as client from '@mailchimp/mailchimp_marketing';

// Server
let app = express(); 
let port = 3100;
app.listen(port, ()=>{
    console.log(`Mailchimp app listening on port ${port}`);
});

// Security
app.use(helmet());
app.use(cors());

// Parser
app.use(express.json());    
app.use(express.urlencoded());

// MailChimp Setup
client.setConfig({
    apiKey: "1270234d66d2190c041fb955b5c566b4",
    server: "us17",
});
const list_id="5d14ffcc56"; // 5d14ffcc56
app.get('/list_interest', async(req, res)=>{
    try {
        const response = await client.lists.listInterestCategoryInterests(
            list_id, // list_id
            "eb1d067474" // interest_category_id
        );
        // console.log(response);
        res.send(response);
    } catch (e) {
        res.status(e.status).json({msg:e.response.body.detail, status_code:e.status});
    }
});
app.post('/add_update_list_member', async(req, res)=>{
    try {
        let text = req.body.interests;
        req.body.interests = JSON.parse(text.replace("'", ""));
        const response = await client.lists.setListMember(list_id,req.body.email_address, req.body );
        res.json({msg:"success", response:response}); 
    } catch (e) {
        res.status(e.status).json({msg:e.response.body.detail, status_code:e.status});
    }
}); 
// Setup Routes
// app.get('/', (req, res)=>{
//     res.send('Welcome to Mailchimp App');
// });

// List Interest Categories
// app.get('/list_interest_categories', (req, res)=>{
//     const run = async () => {
//         const response = await client.lists.getListInterestCategories(list_id);
//         // console.log(response);
//         res.send(response);
//     };
//     run();
// });

// List Interest via Interest Category Id


// List Member
// app.post('/list_member', (req, res)=>{
//     const run = async () => {
//         const response = await client.lists.getListMembersInfo(list_id);
//         let isExist=false;
//         for (let member of response.members) {
//             if(req.body.email_address==member.email_address){
//                 isExist=true;
//             }
//         }
//         res.json({msg:"success", isExist, members:response.members});
//     };
//     run();
// }); 

// Add List Member
// app.post('/add_list_member', (req, res)=>{   
//     //console.log(req.body);
//     const run = async () => {
//         const response = await client.lists.addListMember(list_id, req.body); 
//         res.json({msg:"success", response:response});
//     }; 
//     run();  
// }); 

// Add/update List Member


// Get List Member Info
// app.get('/get_list_member_info', (req, res)=>{
//     //console.log(req.body);
//     const run = async () => {
//         const response = await client.lists.getListMember(list_id, req.query.email_address);
//         res.json({msg:"success", response:response});
//     }; 
//     run();
// });

// check List Member then update interest
// app.post('/check_member_update_interest', async (req, res, next)=>{ 
//     try{
//         // check member exist or not 
//         let text = req.body.interests;
//         let result = JSON.parse(text.replace("'", ""));
//         console.log(req.body);
        
//         const response1 = await client.lists.getListMembersInfo(list_id);
//         let isExist=false;
//         for (let member of response1) {
//             console.log(member.isExist);
//             if(member.email_address===req.body.email_address){
//                 // isExist=true;
//             }
//         } 
//         console.log(isExist);
        
//         // if(isExist){
//         //     console.log("yes exist");
            
//         //     // update member
//         //     const response2 = await client.lists.setListMember(
//         //         list_id,
//         //         req.body.email_address,
//         //         {email_address:req.body.email_address,interests:result,merge_fields:req.body.merge_fields}
//         //     ); 
//         //     res.json({msg:"Success! Member Updated", response:response2});
            
            
//         // }else{
//         //     // add member
//         //     console.log("no exist");
//         //     const response3 = await client.lists.addListMember(list_id, {email_address:req.body.email_address,interests:result,merge_fields:req.body.merge_fields,status:"subscribed"}); 
//         //     res.json({msg:"Success! Member Added", response:response3});
//         // } 
//     } catch (e) {
//         console.log(e.response.body);
         
//         res.status(e.status).json({msg:e.response.body.detail, status_code:e.status});
//     }
// });
 
