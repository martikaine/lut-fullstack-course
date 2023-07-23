import express from "express";
import { v4 as uuid } from "uuid";
import members from "../../Members.js";

const router = express.Router();
const idFilter = (req) => (member) => member.id === parseInt(req.params.id);

router.get("/", (_, res) => res.json(members));

router.get("/:id", (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    res.json(members.filter(idFilter(req)));
  } else {
    res.status(400).json({ msg: `No member found with id: ${req.params.id}` });
  }
});

router.post("/", (req, res) => {
  const newMember = {
    ...req.body,
    id: uuid(),
    status: "active",
  };

  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: "Please include a name and email" });
  }

  members.push(newMember);
  res.json(members);
});

router.put("/:id", (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    members.forEach((member, i) => {
      if (idFilter(req)(member)) {
        const updatedMember = { ...member, ...req.body };
        members[i] = updatedMember;
        res.json({ msg: "Member updated", updatedMember });
      }
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// Delete Member
router.delete("/:id", (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    res.json({
      msg: "Member deleted",
      members: members.filter((member) => !idFilter(req)(member)),
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

export default router;
