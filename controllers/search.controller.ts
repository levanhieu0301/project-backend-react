import { Request, Response } from 'express';
import AccountCompany from '../models/account-company.model';
import City from '../models/cities.model';
import Job from '../models/job.model';

export const language = async (req: Request, res: Response) => {

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

    const jobs = await Job
    .find(find)
    .sort({
      createdAt: "desc"
    })

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
    jobs: dataFinal
  })
};