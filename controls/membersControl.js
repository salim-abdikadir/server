const {
  getAllMembers,
  getMemberById,
  createMember,
  deleteMember,
  updateMebmer,
} = require("../services/memberServices");

exports.getAll = (req, res) => {
  res.json({ msg: getAllMembers() });
};
exports.getById = (req, res) => {
  const id = req.params.id || -1;
  if (id === -1) throw Error("not found");
  res.json({ msg: getMemberById(req.params.id) });
};
exports.post = async (req, res) => {
  const data = req.body;
  try {
    if (Object.getOwnPropertyNames(data).length === 0)
      throw Error("no property");
    res.json({ msg: await createMember(data) });
  } catch (err) {
    res.json({ msg: err.message });
    console.log(data);
  }
};
exports.delete = (req, res) => {
  const id = req.params.id || -1;
  if (id === -1) throw Error("not found");
  res.json({ msg: deleteMember(id) });
};
exports.patch = (req, res) => {
  const id = req.params.id || -1;
  const { data } = req.body;
  if (id === -1) throw Error("not valid member");
  if (Object.getOwnPropertyNames(data).length === 0)
    throw Error("there is no property");
  res.json({ msg: updateMebmer(id, data) });
};
