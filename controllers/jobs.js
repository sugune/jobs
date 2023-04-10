const Job = require('../models/Job');
const StatusCodes = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError
} = require('../errors');

const getJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req;
  const job = await Job.findOne({_id: jobId, createdBy:userId});
  res.status(StatusCodes.OK).json({job});
}

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId});
  res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const createJob = async (req, res) => {
  const {name, userId} = req.user;
  const job = await Job.create({...req.body, createdBy: userId});
  res.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req, res) => {
  const {
    user: {userId}, 
    params:{id:jobId},
    body: {company, position}
  } = req;
  
  if (!company || !position) {
    throw new BadRequestError('values for company AND position are needed');
  }
  const job = await Job.findByIdAndUpdate({_id:jobId, createdBy: userId}, req.body, {new:true, runValidators: true});
  if (!job) {
    throw new NotFoundError(`there is no item with an id of: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req
  const job = await Job.findByIdAndDelete({_id: jobId, createdBy: userId});
  if (!job) {
    throw new NotFoundError(`there is no item with an id of: ${jobId}`);
  }
  res.status(201).json({job});
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob
}