import express from 'express';

import Project from '../models/project';

const projectRouter = express.Router();

projectRouter.post('/new', async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      animation: req.body.animation,
    });

    const savedProject = await newProject.save();

    res.json({
      data: savedProject,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/:projectId', async (req, res) => {
  try {
    const findExistingUser = await Project.findOne({
      _id: req.params.projectId,
    });

    if (findExistingUser) {
      res.json({
        data: findExistingUser,
      });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default projectRouter;
