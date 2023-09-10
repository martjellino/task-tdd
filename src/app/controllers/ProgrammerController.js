const Programmer = require("../models/Programmer");

const index = async (req, res) => {
  try {
    const programmers = await Programmer.find();
    res.json(programmers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const programmer = await Programmer.findById(id);
    if (!programmer) {
      return res.status(404).json({ error: `Programmer's ID is not found` });
    }
    res.json(programmer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const store = async (req, res) => {
  try {
    const { body } = req;
    const { title } = body;

    const hasProgrammer = await Programmer.findOne({ title });
    if (hasProgrammer) {
      return res.status(400).json({ error: 'Duplicated programmer data' });
    }

    const programmer = await Programmer.create(body);
    res.status(200).json(programmer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const programmer = await Programmer.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!programmer) {
      return res.status(404).json({ error: `Programmer's ID is not found` });
    }

    res.json(programmer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const programmer = await Programmer.findByIdAndDelete(id);

    if (!programmer) {
      return res.status(404).json({ error: `Programmer's ID is not found` });
    }

    res.send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
