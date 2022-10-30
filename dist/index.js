"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helmet_1 = require("helmet");
const cors = require("cors");
const client = require("@mailchimp/mailchimp_marketing");
// Server
let app = express();
let port = 3300;
app.listen(port, () => {
    console.log(`Mailchimp app listening on port ${port}`);
});
// Security
app.use((0, helmet_1.default)());
app.use(cors());
// Parser
app.use(express.json());
app.use(express.urlencoded());
// MailChimp Setup
client.setConfig({
    apiKey: "1270234d66d2190c041fb955b5c566b4",
    server: "us17",
});
const list_id = "5d14ffcc56"; // 5d14ffcc56
// Setup Routes
app.get('/', (req, res) => {
    res.send('Welcome to Mailchimp App');
});
// List Interest Categories
app.get('/list_interest_categories', (req, res) => {
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.getListInterestCategories(list_id);
        // console.log(response);
        res.send(response);
    });
    run();
});
// List Interest via Interest Category Id
app.get('/list_interest', (req, res) => {
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.listInterestCategoryInterests(list_id, // list_id
        "eb1d067474" // interest_category_id
        );
        // console.log(response);
        res.send(response);
    });
    run();
});
// List Member
app.post('/list_member', (req, res) => {
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.getListMembersInfo(list_id);
        let isExist = false;
        for (let member of response.members) {
            if (req.body.email_address == member.email_address) {
                isExist = true;
            }
        }
        res.json({ msg: "success", isExist, members: response.members });
    });
    run();
});
// Add List Member
app.post('/add_list_member', (req, res) => {
    //console.log(req.body);
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.addListMember(list_id, req.body);
        res.json({ msg: "success", response: response });
    });
    run();
});
// Add/update List Member
app.post('/add_update_list_member', (req, res) => {
    //console.log(req.body);
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.setListMember(list_id, req.body.email_address, req.body);
        res.json({ msg: "success", response: response });
    });
    run();
});
// Get List Member Info
app.get('/get_list_member_info', (req, res) => {
    //console.log(req.body);
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.lists.getListMember(list_id, req.query.email_address);
        res.json({ msg: "success", response: response });
    });
    run();
});
// check List Member then update interest
app.post('/check_member_update_interest', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check member exist or not
        const response1 = yield client.lists.getListMembersInfo(list_id);
        let isExist = false;
        for (let member of response1.members) {
            if (req.body.email_address == member.email_address) {
                isExist = true;
            }
        }
        if (isExist) {
            // update member
            const response2 = yield client.lists.updateListMember(list_id, req.body.email_address, req.body);
            res.json({ msg: "Success! Member Updated", response: response2 });
        }
        else {
            // add member
            const response3 = yield client.lists.addListMember(list_id, req.body);
            res.json({ msg: "Success! Member Added", response: response3 });
        }
    }
    catch (e) {
        res.status(e.status).json({ msg: e.response.body.detail, status_code: e.status });
    }
}));
