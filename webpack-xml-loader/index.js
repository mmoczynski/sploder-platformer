module.exports = function(xmlText) {

    let FastXMLParser = require("fast-xml-parser");

    let parser = new FastXMLParser.XMLParser({
        ignoreAttributes: false,
    });

    let obj = parser.parse(xmlText);

    /**let s = "let xmlText = `" + xmlText + "`\n";
    s += "let xmlParser = new DOMParser();\n";
    s += "let xmlDoc = xmlParser.parseFromString(xmlText,\"text/xml\");\n"
    s += "module.exports = xmlDoc;\n";
    **/

    //let s = "module.exports = new DOMParser().parseFromString(`" + xmlText + "`,\"text/xml\")"
    
    console.log(obj.objects.playobj[0]);

    let s = "module.exports = " + JSON.stringify(obj);
    return s;
}