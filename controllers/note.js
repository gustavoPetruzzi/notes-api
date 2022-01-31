const { validationResult } = require('express-validator/check');
const handleError = require('../utils/error-handler');
const User = require('../models/user');
const Note = require('../models/note');

exports.getNotes = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findByPk(req.userId);
    if (!user) {
      const error = new Error('The user was not found');
      error.statusCode = 409;
      throw error;
    }
    const notes = await Note.findAll({
      where: {
        receiver: user.id
      }
    });
    return res.status(200).json({
      notes: notes
    });
  } catch (error) {
    return handleError(res, error);
  }
}

exports.addNotes = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, content, receiverId, senderId } = req.body;
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.data();
      throw error;
    }
    const user = await User.findByPk(req.userId);
    if (!user) {
      const error = new Error('The user was not found');
      error.statusCode = 409;
      throw error;
    }
    let receiver;
    // Check if receiver exist
    if (user.id !== senderId) {
      receiver = await User.findByPk(senderId);
      if (!receiver) {
        const error = new Error('The receiver was not found');
        error.statusCode = 409;
        throw error;
      }
    } else {
      receiver = user;
    }
    // Create new date
    const newNote = await Note.create({
      title,
      content,
      receiver: receiverId,
      sender: senderId
    });
    return res.status(201).json({
      message: 'Board created',
      noteId: newNote.dataValues.id
    });
  } catch (error) {
    return handleError(res, error);
  }
}
