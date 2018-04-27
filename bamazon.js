var mysql =require('mysql');
var inquirer = require('inquirer');

//create database connection

var connection =mysql.createConnection({
host:"localhost",
port:3306,
user:"root",
password:"",
database:"bamazon"

});

//Initialize database 
connection.connect(function(err){
    if(err) throw err;
    console.log ("connection Successful");
    maketable();
})

var maketable= function(){
    connection.query("select *from products",function(err,res){
        for(var i=0; i<res.length;i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i].departmentname+" || "+
            res[i].price+" || "+res[i].stockquality+"\n");
        }
        promptCustomer(res);
    })
}

var promptCustomer =function(res){
    inquirer.prompt([{
              type:'input',
              name:'choice',
              message:"What would you like purchase?[Quit with Q]"

    }]).then(function(answer){
        var correct= false;
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        for(var i =0;i<res.length;i++){
            if(res[i].productname==answer.choice){
                correct=true;
                var product=answer.choice;
                var id =i;

                inquirer.prompt({
                    type:"input",
                    name:"quantity",
                    message:"how many would you like to buy?",
                    validate:function(value){
                        if(isNaN(value)==false){
                            return true;
                        }else{
                            return false;
                        }
                    }

                }).then (function(answer){
                    if((res[id].stockquality-answer.quantity)>0){
                        connection.query("update products set stockquality='"+(res[id].stockquality-
                        answer.quantity)+" 'where productname= '"+product+" ' ",function(err,res2){
                            console.log("product Bought!");
                            maketable();
                        })
                    }else{
                        console.log("not a valid selection!");
                        promptCustomer(res);
                    }
                })
            }
        }
        if(i==res.length && correct==false){
            console.log("not a valid Selection");
            promptCustomer(res);
        }
    })
}