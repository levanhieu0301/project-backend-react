
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import AccountUser from '../models/account-user.model';
import AccountCompany from '../models/account-company.model';

export const authen = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    
    if(!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      })
      return;
    }

    const decoded = jwt.verify(token, `${process.env.CODE_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;
    // Tìm User
    const existAccount = await AccountUser.findOne({
      _id: id,
      email: email
    });

    if(existAccount) {
      const infoUser = {
        id: existAccount.id,
        fullName: existAccount.fullName,
        email: existAccount.email
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: infoUser
      })
      return;
    }
    // Tìm Company
    if(!existAccount){
      const existAccountCompany = await AccountCompany.findOne({
        _id: id,
        email: email
      });
      if(existAccountCompany){
        const infoCompany = {
          id: existAccountCompany.id,
          fullName: existAccountCompany.companyName,
          email: existAccountCompany.email
        };

        res.json({
          code: "success",
          message: "Token hợp lệ!",
          infoCompany: infoCompany
        })
        return;
      }
      if(!existAccountCompany){
        res.clearCookie("token");
        res.json({
          code: "error",
          message: "Token không hợp lệ!"
        })
        return;
      }
    }

  } catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    })
    return;
  }
}