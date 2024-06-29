const path = require('path');
const fs = require("fs");

let FastXMLParser = require("fast-xml-parser");


fs.readFile("../client/assets/library_definitions.xml",function(err,data){

    if(err) {
        console.error(err)
    }
    
    else {

        let parser = new FastXMLParser.XMLParser({
            ignoreAttributes: false,
        });

        let obj = parser.parse(data.toString());

        /**let a = [];

        for(let i = 0; i < obj.objects.playobj.length; i++) {

            let o = obj.objects.playobj[i];

            //console.log(obj.objects.playobj);

            a.push({
                shortName: o["@_id"],
                name: o["@_cname"],
                objectID: parseInt(o["@_cid"]),
                rotation: parseInt(o.obj["@_r"]),
                zIndex: parseInt(o.obj["@_z"]),
                category: o["@_ctype"]
            });
        }

        console.log(obj.objects.playobj[0]);

        //console.log(a);

        *

        fs.writeFile("../html5/definitions/definitions.json",JSON.stringify(a,null,"  "),function(err){
            if(err) {
                throw err;
            }
        });

        **/

        fs.writeFile("../html5/definitions/definitions.js","export default " + JSON.stringify(obj,null,"  "),function(err){
            if(err) {
                throw err;
            }
        });
    }
})

/** 





let obj = parser.parse(xmlText);

/**let s = "let xmlText = `" + xmlText + "`\n";
s += "let xmlParser = new DOMParser();\n";
s += "let xmlDoc = xmlParser.parseFromString(xmlText,\"text/xml\");\n"
s += "module.exports = xmlDoc;\n";


//let s = "module.exports = new DOMParser().parseFromString(`" + xmlText + "`,\"text/xml\")"

console.log(obj.objects.playobj[0]);

let s = "module.exports = " + JSON.stringify(obj);

**/
