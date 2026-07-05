import { Request, Response } from 'express';
import City from '../models/cities.model';
import { AccountRequest } from '../interfaces/request.interface';
import AccountCompany from '../models/account-company.model';
import Job from '../models/job.model';

export const cities = async (req: Request, res: Response) => {
  const cityList = await City.find({})

  res.json({
    code: "success",
    message: "Lấy thành phố thành công!",
    cityList: cityList
  })

}
export const profile = async (req: AccountRequest, res: Response) => {
  if(req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  }

  await AccountCompany.updateOne({
    _id: req.account.id
  }, req.body);
  
  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  });


}
export const create = async (req: AccountRequest, res: Response) => {
 req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = [];

  // Xử lý mảng images
  if(req.files) {
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }
  // Hết Xử lý mảng images

  const newRecord = new Job(req.body);
  await newRecord.save();
  
  res.json({
    code: "success",
    message: "Tạo công việc thành công!"
  })
}

export const list = async (req: AccountRequest, res: Response) => {
  const find = {
    companyId: req.account.id
  }
  let page = 1
  const limitItem = 2;
  if(req.query.page){
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0){
      page = currentPage;
    }
  }
  const totalRecords = await Job.countDocuments(find)
  const totalPages = Math.ceil(totalRecords / limitItem);
  const skip = (page - 1) * limitItem;

  const jobs = await Job
    .find(find)
    .limit(limitItem)
    .skip(skip)
    .sort({
      createdAt: "desc"
    })
  const city = await City.findOne({
  _id : req.account.city   
  })
  const dataFinal = []
  for(const item of jobs){
    dataFinal.push({
      id: item.id,
      companyLogo: req.account.avatar,
      title: item.title,
      companyName: req.account.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      companyCity: city?.name,
      technologies: item.technologies
    })
  }

  res.json({
    code: "success",
    infoWork: dataFinal,
    totalPages: totalPages
  })
}
export const edit = async (req: AccountRequest, res: Response) => {
  try {
    const jobs = await Job.findOne({
      _id: req.params.id,
      companyId: req.account.id
    })
    if(!jobs) {
      return res.json({
        code: "error",
        message: "Công việc không tồn tại!"
      })
    }
    res.json({
      code: "success",
      jobs: jobs
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi!"
    })
  }
}

export const editPatch = async (req: AccountRequest, res: Response) => {
try {
    const id = req.params.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
    req.body.images = [];

    // Xử lý mảng images
    if(req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }
    // Hết Xử lý mảng images

    await Job.updateOne({
      _id: id,
      companyId: req.account.id
    }, req.body)

    res.json({
      code: "success",
      message: "Cập nhật công việc thành công!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}
export const deleteJob = async (req: AccountRequest, res: Response) => {
  try {
  const id = req.params.id;
  const existJob = await Job.findOne({
    _id: id,
    companyId: req.account.id
  })
  if(!existJob) {
    return res.json({
      code: "error",
      message: "Công việc không tồn tại!"
    })
  }
  await Job.deleteOne({
    _id: id,
    companyId: req.account.id
  })
  res.json({
    code: "success",
    message: "Xóa công việc thành công!"
  })
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi!"
    })
  }
}
