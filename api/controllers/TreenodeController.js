/**
 * TreenodeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

    create: async function(req, res) {
        var params = req.query;
        var parentNode = req.param('parentNode');

        var treenode = await Treenode.create(params).fetch();

        if ( parentNode !== null ) {

            var pnode = await Treenode.find({ id: parentNode });

            var children = [];
            if (pnode[0].childrenNodes)
                children = pnode[0].childrenNodes;
            
            children.push( treenode );

            await Treenode.update( { id: parentNode } )
                    .set({ childrenNodes: children });
        }

        return res.json({
            notFound: false,
            treenodeData: treenode
        })
        
    },

    getChildrenNodes: function(req, res) {
        var nodeName = req.param('nodeName')

        Treenode.find({ nodeIdentifier: nodeName })
            .exec(function(err,treenode) {
                if (err) {
                    return res.json({ error: err })
                }
                if (!treenode) {
                    return res.notFound()
                }
                else {
                    return res.json({
                        notFound: false,
                        treenodeData: treenode[0].childrenNodes
                    })
                }
            })

    },

    changeParent: async function(req, res) {
        var nodeName = req.param('nodeName')
        var newParentName = req.param('parentName')
       
        if (nodeName && newParentName) {

            var currNode = await Treenode.find({ nodeIdentifier: nodeName });
            
            var newParentNode = await Treenode.find({ nodeIdentifier: newParentName });

            var oldParentNode = await Treenode.find({ id: currNode[0].parentNode });
            
            var newHeight = newParentNode[0].nodeHeight + 1;
            var updatedNode = await Treenode.update({ nodeIdentifier: nodeName } )
                                        .set({ 
                                            parentNode: newParentNode[0].id,
                                            nodeHeight: newHeight
                                         })
                                        .fetch();

            //Update children for new Parent
            var children_newParent = [];
            if (newParentNode[0].childrenNodes && newParentNode[0].childrenNodes.length)
                children_newParent = newParentNode[0].childrenNodes;
            
            children_newParent.push( updatedNode );

            await Treenode.update({ nodeIdentifier: newParentNode[0].nodeIdentifier } )
                        .set({ 
                            childrenNodes: children_newParent,
                         });

            //Update children for old Parent
            var children_oldParent = [];
            if (oldParentNode[0].childrenNodes && oldParentNode[0].childrenNodes.length)
                children_oldParent = oldParentNode[0].childrenNodes;
            
            var indexCurrNode = children_oldParent.findIndex(function(item,i){
                return item.nodeIdentifier === currNode.nodeIdentifier;
            });

            children_oldParent.splice(indexCurrNode,1);

            await Treenode.update({ nodeIdentifier: oldParentNode[0].nodeIdentifier } )
                        .set({ childrenNodes: children_oldParent });

            return res.json({
                notFound: false,
                treenodeData: updatedNode
            })
        }    
        else {
            return res.notFound();
        }
    },

};

