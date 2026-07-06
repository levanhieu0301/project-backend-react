import { Request, Response } from "express";
import AccountCompany from "../models/account-company.model"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import City from "../models/cities.model";
import Job from "../models/job.model";

export const companyRegister = async (req: Request, res: Response) => {
  const { companyName, email, password } = req.body;

  const existAccount = await AccountCompany.findOne({
    email: email
  });

  if(existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  // Mã hóa mật khẩu với bcrypt
  const salt = await bcrypt.genSalt(10); // Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
  const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu

  const newAccount = new AccountCompany({
    companyName: companyName,
    email: email,
    password: hashedPassword
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!",
  });
}

export const companyLogin = async (req: Request, res: Response) => {
  const {email, password} = req.body;
  const existAccount = await AccountCompany.findOne({
    email: email,
  })
  if(!existAccount){
    res.json({
      code: "error",
      message: "Email chưa được đăng ký!"
    })
    return;
  }
  const decodePassword = await bcrypt.compare(password, `${existAccount.password}`);
  if(!decodePassword){
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    })
    return;
  }
  // Tạo jwt trả token về FE
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email
    }, 
    `${process.env.CODE_SECRET}`, 
    { 
      expiresIn: "1d"
    });
  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // Token có hiệu lực trong 1 ngày
    httpOnly: true, // Chỉ cho phép cookie được truy cập bởi server
    sameSite: "lax", // Cho phép gửi cookie giữa các tên miền
    secure: process.env.NODE_ENV === "production" // true: web có https, false: web không có https
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
  });


  
}
export const list = async (req: Request, res: Response) => {
  let limitCompany = 12;
  if(req.query.limitItems) {
    limitCompany = parseInt(`${req.query.limitItems}`);
  }
  const companyList = await AccountCompany
    .find({})
    .limit(limitCompany)
  const dataFinal = [];
  for(const company of companyList) {
    const dataItemFinal = {
      id: company.id,
      logo: company.avatar,
      companyName: company.companyName,
      cityName: "",
      totalJob: 0

    };
    
    // Thành phố
    const city = await City.findOne({
      _id: company.city
    });
    dataItemFinal.cityName = `${city?.name}`;
    // Tổng số công việc
    const totalJob = await Job.countDocuments({
      companyId: company.id
    });
    dataItemFinal.totalJob = totalJob;

    dataFinal.push(dataItemFinal)


  }

  res.json({
    code: "success",
    companyList: dataFinal
  });
}
