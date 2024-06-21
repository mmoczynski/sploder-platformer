import dictionary from "../definitions/definitions.json"

function DefinitionTree() {

    this.categories = {}

    let a = dictionary.objects.playobj

    for(var i = 0; i < a.length; i++) {

        // Assign objectID to dictionary entry
        this[a[i]["@_cid"]] = a[i];

        // Create category if it does not exist
        if(!this.categories[a[i]["@_ctype"]]) {
            this.categories[a[i]["@_ctype"]] = []
        }

        // Put object definition in category
        this.categories[a[i]["@_ctype"]].push(a[i]);

        
    }


}

export default DefinitionTree;