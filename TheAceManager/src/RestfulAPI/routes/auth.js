//Requirements
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const MySessions = require('../model/MySessions');
const Password = require('../model/Password');

//temporary Data
var ID;
var NewSessionID;
var AuthToken;

//imports
const { 
    registerValidation, 
    loginValidation,  
    addPasswordGenerationValidation,
} = require('../validation');
const {encrypt, decrypt} = require('../encryptionHandler');

router.get('/test',  (req, res) =>{
    res.send("Route One Working !");
});

router.get("/SessionStart", (req, res)=>{

    
    req.sessionID;
    req.session.email = ID
    req.session.authenticated = true;
    

    NewSessionID = req.sessionID;
    var NewSessionEmail = ID
    var NewSessionAuthenticated = req.session.authenticated;


    const NewSession = new MySessions({

        SessionID: NewSessionID,
        Email: NewSessionEmail,
        Authenticated: NewSessionAuthenticated

    });

    try{
        NewSession.save();
        
    }catch(err){
        res.status(400).send(err)
    }

    res.end();

});

router.post('/register', async(req, res)=>{

    //Validate the data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if user is in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //Create a user for the database
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    //save a user to the database and check for errors
    try{
        await user.save();
        res.send('Successful');
    }catch(err){

        console.log('ERROR!')
        res.status(400).send('Failed');
    }
    
});


router.post('/login', async (req, res) =>{

    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

     //Check if email exists is in the database
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email or Password is wrong!');

    //check if password is right
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password!')

    try{
        AuthToken = jwt.sign({_id: user._id}, process.env.TOKEN); 
        ID = req.body.email;
    res.send('success');
    }catch(err){

        console.log('ERROR!')
        res.status(400).send('Failed');
    }
});

router.patch('/UpdateUserPassword', verifySession, verifyToken, async(req, res)=>{
    console.log(req.body)
    var NewPassword = req.body.password
    console.log(NewPassword);
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(NewPassword, salt);
    try{
        await User.updateOne(
            {email:ID},
            {$set:{password: hashPassword}}
        );
    }catch(err){
        res.send(err);  
    }

    
})


router.delete('/logout', verifySession, verifyToken, async (req, res) =>{

    try{

        req.session.destroy();
        await MySessions.deleteOne({SessionID: NewSessionID});
           
    }catch(err){
        res.send(err)
    }

});

router.post('/addPassword', verifySession, verifyToken, async(req, res) =>{
    
    const { error } = loginValidation(req.body);
    const{passwordTitle, password} = req.body;
    const hashedPassword = encrypt(password);

    const newPassword = new Password({

        passwordUserID: ID,
        passwordTitle: passwordTitle,
        password: hashedPassword.password,
        iv: hashedPassword.iv,

    });  

    try{
        await newPassword.save();
        var data = "success"
        res.send(data.toString());
    }catch(err){
        res.send("Failed");
    }
});

router.get('/showPasswords', verifySession, verifyToken,  async(req, res) =>{

    var arrayTesting = []
    
    await Password.find({}).then((result)=>{
        
        result.forEach((note)=>{
          arrayTesting.push(note)
        }); 
    });
    res.send(arrayTesting);
});

router.post('/decryptPassword', verifySession, verifyToken, (req, res) =>{
    
    var Title = req.body.passwordTitle
    findPassword()
    async function findPassword(){
        const Test = await Password.findOne({passwordUserID: ID, passwordTitle: Title})
        var password = Test.password;
        var iv = Test.iv;
        const body = {password: password, iv: iv}
        const showPassword = (decrypt(body));
        res.send(showPassword)
    }
})

router.delete('/DeletePassword', verifySession, verifyToken,(req, res) =>{
    
    var Title = req.body.passwordTitle
    DeletePassword()
    async function DeletePassword(){
        try{
    
           await Password.findOneAndDelete({passwordUserID: ID, passwordTitle: Title})
        }
    
        catch(err){
            res.send(err)
        }
    }
})

router.patch('/EditPassword', verifySession, verifyToken, async (req, res) =>{

    var Title = req.body.passwordTitle;
    var NewTitle = req.body.NewPasswordTitle;
    var NewPassword = req.body.password;
    const hashedPassword = encrypt(NewPassword);

    try{
        await Password.updateOne(
            //Find  
            {passwordUserID: ID, passwordTitle: Title},
            //Set
            {$set:{passwordTitle: NewTitle, password: hashedPassword.password, iv: hashedPassword.iv}}
            
        );
    }catch(err){    
        res.send(err);
    }

});


router.get('/password',verifySession, verifyToken, callPassword);

function callPassword(req, res) {

    var spawn = require("child_process").spawn;

    var process = spawn('python', ["src/PythonScript/password.py", req.query.password]);

    process.stdout.on('data',function(data){

        res.send(data.toString());
        res.end()

    })

}

router.get('/checkSession', verifySession, verifyToken,(req, res) =>{
    res.send('Session Working!');
});

async function verifySession(req, res, next) {{
    
    const CheckSession = await MySessions.findOne({SessionID: NewSessionID});
    if(CheckSession.Authenticated){
        
        next();
    }
    
}};

async function verifyToken(req, res, next)
{{
    if(!AuthToken) return res.status(401).send('Access Denied');

    try{
        jwt.verify(AuthToken, process.env.TOKEN);
        next();
    }catch(err){
        res.status(400).send('Invalid Token')
    }

}}

module.exports = router;