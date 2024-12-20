const http = require("http");
const fs = require("fs");

// Object for associating projectIDs with 

const projectIds = {}

const server = http.createServer(function(req, res){

    console.log(new Date() + " : " + "Request to domain: " + req.headers.host );
    console.log(new Date() + " : " + "URL Requested: " + req.url);

    // Null is used to make it so it can read it as binary file
    if(req.url.includes("creator2_b17.swf")) {

        console.log(new Date() + " : Attemping to request flash file...");

        fs.readFile("./sitelock-removed.swf", null, function(err, data)  {

            if(err) {
                console.log(err);
            }
    
            else {
                res.writeHead(200, { 'Content-Type': "application/x-shockwave-flash" });
                res.write(data);
                res.end();
            }
        });

    }

    // Full game flash file
    else if(req.url.includes("fullgame2_b17.swf")) {

        console.log(new Date() + " : Attemping to request full game file...");

        fs.readFile("./fullgame2_b17.swf", null, function(err, data)  {

            if(err) {
                console.log(err);
            }
    
            else {
                res.writeHead(200, { 'Content-Type': "application/x-shockwave-flash" });
                res.write(data);
                res.end();
            }
        });

    }

    // File for dealing with ruffle
    else if(req.url.endsWith("/creator")) {
        fs.readFile("./creator-ruffle.html", null, function(err, data){
            
            if(err) {
                console.log(err)
            }

            else {
                res.write(data);
                res.end();
            }

        })
    }

    // Get project list from folder

    else if(req.url.includes("php/getprojects.php")) {

        fs.readdir("./saved", function(err, stringArr){

            // If error, end connection

            if(err) {
                console.log(err);
                res.end();
            }

            else {

                // Loop through members of saved directory

                var xmlStr = "<projects>";

                for(let i = 0; i < stringArr.length; i++) {

                    // Get project name from file name for XML file
                    let name = encodeURIComponent(stringArr[i].split(".")[0]);

                    // Associate filename with project id
                    projectIds[i] = name;

                    // XML child element for project
                    xmlStr += `<project id="proj${i}" src="proj1946507.xml" title="${name}" date="Sunday, July 25th 2010" archived="0"/>`
                }

                xmlStr += "</projects>"

                res.writeHead(200, {
                    "Content-Type": "Application/xml"
                  });

                res.write(xmlStr);

                // When selected, it requests
                // /php/getproject.php?nosession=1&u=0&c=undefined&p=1946507&nocache=22685043
      
                res.end();

            }

        });
    
    }

    // Currently gets project regardless of input for now

    else if(req.url.includes("getproject.php")) {
        
        /*var x = `<project title="Grenade%20Test" pubkey="" fast="0" isprivate="0" mode="2" author="geoff" date="Wednesday, June 5, 2013" id="proj3730014" comments="1" g="1" bitview="0">
            <levels id="levels">
                <level music="" env="5,336699,3300,100" name="">
                    55,-270,30,0,0,0|3,90,330,0,0,0|3,-30,390,0,0,0|3,90,210,0,0,0|3,30,390,0,0,0|3,90,390,0,0,0|3,30,150,0,0,0|3,-30,150,0,0,0|3,-30,330,0,0,0|3,90,270,0,0,0|55,-330,30,0,0,0|3,-30,210,0,0,0|55,-210,30,0,0,0|55,-150,30,0,0,0|55,-90,30,0,0,0|55,-30,30,0,0,0|55,30,30,0,0,0|55,90,30,0,0,0|55,-390,30,0,0,0|3,90,150,0,0,0|302,165,67,0,0,0|1,26,242,0,0,0|155,60,360,0,0,0
                </level>
            </levels>
        </project>`*/

        

        res.writeHead(200, {
            "Content-Type": "Application/xml"
        });
  
        res.write(x);
  
        res.end();

    }

    else if(req.url.includes("saveproject2.php")) {

        var data = [];

        req.on("data", function(chunk){
            data.push(chunk)
        });

        req.on("end", function(){

            /**
             * The flash creator sends a request body containing the XML encoded as a URI compoent like so:
             * xml= ENCODED XML GOES HERE
             * 
             */

            let str = decodeURIComponent(data.concat().toString().split("=")[1]);
            console.log("Save Data:" + str);

            res.writeHead(200, {
                "Content-Type": "Application/xml"
            });

            /**
             * Write response to flash player request as XML file
             * 
             */
          
            res.write("<response result=\"success\" id=\"600\"></response>");

            res.end();
        });

    }

    else if(req.url.includes("savegamedata2.php")) {

        var data = [];

        req.on("data", function(chunk){
            data.push(chunk)
        });

        req.on("end", function(){

            /**
             * Simular to save:
             * 
             * The flash creator sends a request body containing the XML encoded as a URI compoent like so:
             * xml= ENCODED XML GOES HERE
             * 
             */

            let str = decodeURIComponent(data.concat().toString().split("=")[1]);
            console.log("Publish data: " + str);
            

            /**
             * Write response to flash player request as XML file if successful/
             * 
             */
          
            res.write("<response result=\"success\" id=\"600\"></response>");

            res.end();

        });
    }

    else {
        res.writeHead(404);
        res.write("404 page not found")
        res.end();
    }

});

const port = Number.parseInt(process.argv[2]) || 8081;
const host = process.argv[3] || "localhost";

server.on("error", function(error){

    if(error.code === "EADDRINUSE") {
        console.error("The port " + error.port + " is already in use. Try a different one.");
    }

    else {
        console.error(error);
    }

});

server.listen(port, host, undefined, function(){
    console.log(`Server at http://${host}:${port}/`)
});