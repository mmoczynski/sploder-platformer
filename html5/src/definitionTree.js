import dictionary from "../definitions/definitions.json"

const definitionTree = {
    categories: {}
}

let a = dictionary.objects.playobj

for(var i = 0; i < a.length; i++) {

    // Assign objectID to dictionary entry
    definitionTree[a[i]["@_cid"]] = a[i];

    // Create category if it does not exist
    if(!definitionTree.categories[a[i]["@_ctype"]]) {
        definitionTree.categories[a[i]["@_ctype"]] = []
    }

    // Put object definition in category
    definitionTree.categories[a[i]["@_ctype"]].push(a[i]);

    
}

export default definitionTree;