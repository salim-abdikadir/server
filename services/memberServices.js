const memberModel = require("../models/Member")

exports.getAllMembers = ()=>{
        return memberModel.findActive();
}

exports.getMemberById = (id)=>{
    return memberModel.findOneActive({_id:id});
}   

exports.createMember = (memberData)=>{
    return memberModel.createActive(memberData)
}

exports.updateMebmer = (id, updatedData) =>{
    return 'updated the member'
}
exports.deleteMember = (id) =>{
    return 'deleted The member'
}