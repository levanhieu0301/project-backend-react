import { Request, Response } from 'express';
import City from '../models/cities.model';
import { AccountRequest } from '../interfaces/request.interface';
import AccountCompany from '../models/account-company.model';

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