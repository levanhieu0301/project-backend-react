import { Request, Response } from 'express';
import AccountCompany from '../models/account-company.model';
import City from '../models/cities.model';
import Job from '../models/job.model';

export const language = async (req: Request, res: Response) => {
    let totalPage = 1;
  const dataFinal = []
  console.log(req.query.language)
  console.log(req.query.city)

  if(Object.keys(req.query).length > 0) {
    const find: any = {
    }
    if(req.query.language) {
      find.technologies = req.query.language
    }


    if(req.query.city) {
      const city = await City.findOne({
        name: `${req.query.city}`
      })
      if(city){
        const listCompany = await AccountCompany.find({
          city: city.id
        })
        const listCompanyId = listCompany.map((item) => item.id)
        find.companyId = { $in: listCompanyId }
      }
    }
    

    if(req.query.company) {
      const accountCompany = await AccountCompany.findOne({
        companyName: req.query.company as string
      })
      find.companyId = accountCompany?.id;
    }
    if(req.query.keyword) {
      const keywordRegex = new RegExp(`${req.query.keyword}`, "i");
      find.title = keywordRegex;
    }
    
    if(req.query.position) {
      find.position = req.query.position;
    }
    if(req.query.workingForm) {
      find.workingForm = req.query.workingForm;
    }
    // Phân trang
    const limitItems = 2;
    let page = 1;
    if(req.query.page) {
      const currentPage = parseInt(`${req.query.page}`);
      if(currentPage > 0) {
        page = currentPage;
      }
    }
    const totalRecord = await Job.countDocuments(find);
    totalPage = Math.ceil(totalRecord/limitItems);
    if(page > totalPage) {
      page = 1;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang


    const jobs = await Job
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);

    for (const item of jobs) {
      const itemFinal = {
        id: item.id,
        companyLogo: "",
        title: item.title,
        companyName: "",
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        cityName: "",
        technologies: item.technologies
      };

      // Thông tin công ty
      const infoCompany = await AccountCompany.findOne({
        _id: item.companyId
      })

      if(infoCompany) {
        itemFinal.companyLogo = `${infoCompany.avatar}`;
        itemFinal.companyName = `${infoCompany.companyName}`;

        const city = await City.findOne({
          _id: infoCompany.city
        })
        itemFinal.cityName = `${city?.name}`;
      }

      dataFinal.push(itemFinal);
    }
  }

  res.json({
    code: "success",
    message: `Language is ${language}`,
    jobs: dataFinal,
    totalPage: totalPage
  })
};