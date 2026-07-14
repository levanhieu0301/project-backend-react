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
  let limitItems = 9;
  if(req.query.limitItems) {
    limitItems = parseInt(`${req.query.limitItems}`);
  }
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) {
      page = currentPage;
    }
  }
  const totalRecord = await Job.countDocuments({});
  const totalPage = Math.ceil(totalRecord/limitItems);
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  const companyList = await AccountCompany
    .find({})
    .limit(limitItems)
    .skip(skip);
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
    companyList: dataFinal,
    totalPage: totalPage
  });
}
export const companyDetail = async (req: Request, res: Response) => {
   try {
    const id = req.params.id;

    const record = await AccountCompany.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "Thất bại!"
      })
      return;
    }

    // Thông tin công ty
    const companyDetail = {
      id: record.id,
      avatar: record.avatar,
      companyName: record.companyName,
      address: record.address,
      companyModel: record.companyModel,
      companyEmployees: record.companyEmployees,
      workingTime: record.workingTime,
      workOvertime: record.workOverTime,
      description: record.description,
    };

    // Danh sách công việc
    const jobs = await Job
      .find({
        companyId: id
      })
      .sort({
        createdAt: "desc"
      });

    const city = await City.findOne({
      _id: record.city
    })

    const dataFinal = [];

    for (const item of jobs) {
      dataFinal.push({
        id: item.id,
        companyLogo: record.avatar,
        title: item.title,
        companyName: record.companyName,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        cityName: city?.name,
        technologies: item.technologies
      });
    }

    res.json({
      code: "success",
      message: "Thành công!",
      companyDetail: companyDetail,
      jobs: dataFinal
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Thất bại!"
    })
  }

}