import express from 'express';
import mongoose from 'mongoose';

import Project from '../models/project';

const projectRouter = express.Router();

projectRouter.post('/new', async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      animation: req.body.animation,
      owner: req.headers.authorization,
      collaborators: [req.headers.authorization],
    });

    const savedProject = await newProject.save();

    res.json({
      data: savedProject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.patch('/:projectId/invite', async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: req.params.projectId,
      },
      {
        collaborators: [...req.body.userIds],
      },
      { new: true }
    );

    res.json({
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/:projectId', async (req, res) => {
  try {
    const findExistingProject = await Project.findOne({
      _id: req.params.projectId,
      collaborators: new mongoose.Types.ObjectId(req.headers.authorization),
    });

    if (findExistingProject) {
      res.json({
        data: findExistingProject,
      });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/', async (req, res) => {
  try {
    const allProjects = await Project.find({
      collaborators: new mongoose.Types.ObjectId(req.headers.authorization),
    });

    res.json({
      data: allProjects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default projectRouter;
